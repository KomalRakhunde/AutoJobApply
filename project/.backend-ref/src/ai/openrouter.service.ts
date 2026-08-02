import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as crypto from 'crypto';

@Injectable()
export class OpenRouterService {
  private client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  // In-memory cache for deterministic responses on identical prompts
  private cache = new Map<string, string>();

  async generate(prompt: string): Promise<string> {
    // Generate SHA-256 hash of the prompt for exact caching
    const hash = crypto.createHash('sha256').update(prompt.trim()).digest('hex');

    if (this.cache.has(hash)) {
      return this.cache.get(hash)!;
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: 'inclusionai/ling-3.0-flash:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.0, // 0.0 temperature for 100% deterministic output on identical inputs
      });

      const responseText = completion.choices[0]?.message?.content ?? '';
      
      if (responseText) {
        this.cache.set(hash, responseText);
      }

      return responseText;
    } catch (err) {
      console.error('OpenRouter Service API Error:', err);
      throw err;
    }
  }
}