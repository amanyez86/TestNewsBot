import Parser from 'rss-parser';
import { CONFIG } from './config.js';
import fetch from 'node-fetch';

export class NewsService {
  constructor(cache) {
    this.parser = new Parser();
    this.cache = cache;
  }

  async fetchNews() {
    try {
      const response = await fetch(CONFIG.RSS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const feed = await this.parser.parseString(text);
      return feed.items.filter(item => !this.cache.hasArticle(item.guid));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  createNewsEmbed(article) {
    return {
      title: article.title,
      description: article.contentSnippet,
      url: article.link,
      color: 0xFF0000,
      timestamp: new Date(article.pubDate).toISOString(),
      footer: {
        text: 'BBC News'
      }
    };
  }
}