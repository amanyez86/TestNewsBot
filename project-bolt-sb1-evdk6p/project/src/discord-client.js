import { Client, GatewayIntentBits } from 'discord.js';
import { CONFIG } from './config.js';

export class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
      failIfNotExists: false
    });
    this.newsChannel = null;
    this.retryCount = 0;
  }

  async connect() {
    try {
      await this.client.login(process.env.DISCORD_TOKEN);
      console.log(`Logged in as ${this.client.user.tag}`);
      this.newsChannel = await this.client.channels.fetch(process.env.CHANNEL_ID);
    } catch (error) {
      console.error('Error connecting to Discord:', error);
      if (this.retryCount < CONFIG.MAX_RETRIES) {
        this.retryCount++;
        console.log(`Retrying connection in ${CONFIG.RECONNECT_DELAY}ms... (Attempt ${this.retryCount}/${CONFIG.MAX_RETRIES})`);
        setTimeout(() => this.connect(), CONFIG.RECONNECT_DELAY);
      } else {
        console.error('Max retry attempts reached. Please check your configuration.');
        process.exit(1);
      }
    }
  }

  async sendNews(article, newsService) {
    if (!this.newsChannel) return;
    
    try {
      await this.newsChannel.send({
        embeds: [newsService.createNewsEmbed(article)]
      });
    } catch (error) {
      console.error('Error sending news:', error);
    }
  }
}