import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { CONFIG } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = `${__dirname}/cache.json`;

export class Cache {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        return JSON.parse(fs.readFileSync(CACHE_FILE));
      }
    } catch (err) {
      console.error('Error loading cache:', err);
    }
    return { seenGuids: [] };
  }

  save() {
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(this.data));
    } catch (err) {
      console.error('Error saving cache:', err);
    }
  }

  addArticle(guid) {
    this.data.seenGuids.push(guid);
    if (this.data.seenGuids.length > CONFIG.MAX_CACHE_SIZE) {
      this.data.seenGuids = this.data.seenGuids.slice(-CONFIG.MAX_CACHE_SIZE);
    }
    this.save();
  }

  hasArticle(guid) {
    return this.data.seenGuids.includes(guid);
  }
}