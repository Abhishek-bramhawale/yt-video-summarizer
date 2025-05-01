declare module 'youtube-captions-scraper' {
  interface Caption {
    text: string;
    start: number;
    duration: number;
  }

  export function getSubtitles(options: {
    videoID: string;
    lang?: string;
  }): Promise<Caption[]>;
}

declare module 'node-nlp' {
  export class NlpManager {
    constructor(settings?: { languages: string[] });
    process(language: string, text: string): Promise<any>;
  }
} 