# YouTube Video Summarizer

A modern web application that uses AI to generate concise summaries of YouTube videos. Built with Next.js and powered by Hugging Face's AI models.

## Features

- 🎥 Summarize any YouTube video with English captions
- 🤖 Powered by Hugging Face's BART model for high-quality summaries
- 💻 Clean, modern UI with responsive design
- ⚡ Fast and efficient processing
- 🔍 Smart error handling and user feedback

## Prerequisites

- Node.js 14.x or later
- npm or yarn
- A Hugging Face API key

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

- The video must have English captions available
- You can check for captions by looking for the CC (Closed Captions) button in the YouTube player
- Longer videos may take more time to process
- The quality of the summary depends on the quality of the video's captions

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Hugging Face](https://huggingface.co/) - AI models
- [youtube-captions-scraper](https://www.npmjs.com/package/youtube-captions-scraper) - Caption extraction

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hugging Face for providing the AI models
- YouTube for making captions available
- The open-source community for their amazing tools and libraries 