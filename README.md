# YouTube Video Summarizer

A web application that uses AI to generate simple summary of YouTube videos. Built with Next.js and powered by Hugging Face's AI models which are free to use.

## Features

- Summarize any YouTube video with English captions
- Powered by Hugging Face's BART model for awesome summaries
-  Clean, modern UI with responsive design
-  Fast and efficient processing
-  Smart error handling and user feedback

## Prerequisites

- Node.js 
- npm or you can also use yarn
- A Hugging Face API key (you can get it for free from hugging face site)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-video-summarizer.git
cd youtube-video-summarizer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Hugging Face API key:
```
HUGGINGFACE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a YouTube video URL in one of these formats:
   - https://www.youtube.com/watch?v=VIDEO_ID
   - https://youtu.be/VIDEO_ID
   - https://youtube.com/shorts/VIDEO_ID

2. Click "Summarize Video" and wait for the AI to generate a summary.

## Important Notes

- video must have English captions available
- You can check for captions by looking for the CC button in the YouTube 
- Longer videos may take more time to process
- The quality of the summary depends on the quality of the video's captions

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Hugging Face](https://huggingface.co/) - AI model
- [youtube-captions-scraper](https://www.npmjs.com/package/youtube-captions-scraper) - Caption extraction
