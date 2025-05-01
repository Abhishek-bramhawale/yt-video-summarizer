import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorDetails('');
    setSummary('');

    // Basic URL validation
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      setErrorDetails('The URL should be in one of these formats:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n• https://youtube.com/shorts/VIDEO_ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize video');
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'Error summarizing video. Please try again.');
      if (err.details) {
        setErrorDetails(err.details);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>YouTube Video Summarizer</title>
        <meta name="description" content="Summarize YouTube videos using AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            YouTube Video Summarizer
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Get AI-powered summaries of any YouTube video with English captions
          </p>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Important Note</h2>
              <p className="text-blue-700">
                This tool only works with YouTube videos that have English captions available.
                You can check if a video has captions by looking for the CC (Closed Captions) button in the YouTube player.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video URL
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Supported URL formats:
                  <br />
                  • https://www.youtube.com/watch?v=VIDEO_ID
                  <br />
                  • https://youtu.be/VIDEO_ID
                  <br />
                  • https://youtube.com/shorts/VIDEO_ID
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Summarizing...
                  </span>
                ) : (
                  'Summarize Video'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                <p className="font-medium">{error}</p>
                {errorDetails && (
                  <p className="mt-2 text-sm whitespace-pre-line">{errorDetails}</p>
                )}
              </div>
            )}

            {summary && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Summary</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{summary}</p>
                </div>
              </div>
            )}
          </div>

          <footer className="text-center text-gray-500 text-sm">
            <p>Built with Next.js and Hugging Face AI</p>
          </footer>
        </div>
      </main>
    </div>
  );
} 