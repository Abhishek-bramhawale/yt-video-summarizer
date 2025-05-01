import { NextApiRequest, NextApiResponse } from 'next';
import { getSubtitles } from 'youtube-captions-scraper';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  try {
    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ 
        error: 'Invalid YouTube URL',
        details: 'Please provide a valid YouTube video URL in one of these formats:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n• https://youtube.com/shorts/VIDEO_ID'
      });
    }

    try {
      // Get video captions
      const captions = await getSubtitles({
        videoID: videoId,
        lang: 'en'
      });

      if (!captions || captions.length === 0) {
        return res.status(400).json({ 
          error: 'No English captions found for this video',
          details: 'This video does not have English captions available. Please try a different video that has English captions enabled. You can check if a video has captions by looking for the CC (Closed Captions) button in the YouTube player.'
        });
      }

      // Combine all captions into a single text
      const fullText = captions.map(caption => caption.text).join(' ');

      // Call Hugging Face API for summarization
      const summary = await summarizeWithHuggingFace(fullText);

      res.status(200).json({ summary });
    } catch (error: any) {
      if (error.message?.includes('Could not find en captions')) {
        return res.status(400).json({
          error: 'No English captions available',
          details: 'This video does not have English captions. Please try a different video that has English captions enabled. You can check if a video has captions by looking for the CC (Closed Captions) button in the YouTube player.'
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to summarize video',
      details: error.message
    });
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

async function summarizeWithHuggingFace(text: string): Promise<string> {
  // Using a more permissive model endpoint
  const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
  const API_KEY = process.env.HUGGINGFACE_API_KEY;

  if (!API_KEY) {
    throw new Error('Hugging Face API key is not configured. Please add HUGGINGFACE_API_KEY to your .env file');
  }

  try {
    // Split text into chunks if it's too long (BART has a max input length)
    const chunks = splitTextIntoChunks(text, 1024);
    const summaries = [];

    for (const chunk of chunks) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: chunk,
          parameters: {
            max_length: 150,
            min_length: 30,
            do_sample: false,
            num_beams: 4,
            early_stopping: true
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Hugging Face API error: ${response.statusText}${
            errorData ? ` - ${JSON.stringify(errorData)}` : ''
          }`
        );
      }

      const result = await response.json();
      
      if (!result || !result[0] || !result[0].summary_text) {
        throw new Error('Invalid response from Hugging Face API');
      }

      summaries.push(result[0].summary_text);
    }

    // Combine summaries if there were multiple chunks
    return summaries.length > 1 
      ? await combineSummaries(summaries)
      : summaries[0];
  } catch (error: any) {
    console.error('Hugging Face API error:', error);
    throw new Error(
      `Failed to generate summary: ${error.message}. Please make sure your API key is valid and has the necessary permissions.`
    );
  }
}

function splitTextIntoChunks(text: string, maxLength: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        // If a single sentence is too long, split it by words
        const words = sentence.split(' ');
        let tempChunk = '';
        for (const word of words) {
          if ((tempChunk + ' ' + word).length > maxLength) {
            chunks.push(tempChunk.trim());
            tempChunk = word;
          } else {
            tempChunk += (tempChunk ? ' ' : '') + word;
          }
        }
        if (tempChunk) {
          currentChunk = tempChunk;
        }
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function combineSummaries(summaries: string[]): Promise<string> {
  // If we have multiple summaries, combine them into a single coherent summary
  const combinedText = summaries.join(' ');
  
  // If the combined text is short enough, return it directly
  if (combinedText.length <= 1024) {
    return combinedText;
  }

  // Otherwise, summarize the combined summaries
  return summarizeWithHuggingFace(combinedText);
} 