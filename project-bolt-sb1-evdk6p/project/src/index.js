import dotenv from 'dotenv';
import { CONFIG } from './config.js';
import { Cache } from './cache.js';
import { NewsService } from './news-service.js';
import { DiscordBot } from './discord-client.js';

dotenv.config();

async function main() {
  const cache = new Cache();
  const newsService = new NewsService(cache);
  const bot = new DiscordBot();

  await bot.connect();

  async function checkNews() {
    try {
      const newArticles = await newsService.fetchNews();
      
      for (const article of newArticles) {
        await bot.sendNews(article, newsService);
        cache.addArticle(article.guid);
      }
    } catch (error) {
      console.error('Error in news check cycle:', error);
    }
  }

  // Start checking for news
  setInterval(checkNews, CONFIG.CHECK_INTERVAL);
  checkNews(); // Initial check
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});