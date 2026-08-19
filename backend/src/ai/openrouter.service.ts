import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as crypto from 'crypto';

@Injectable()
export class OpenRouterService {
  private cache = new Map<string, string>();

  private getClient(): { client: OpenAI; model: string } {
    const groqKey = process.env.GROQ_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    const REQUEST_TIMEOUT_MS = 30000;

    if (groqKey && groqKey.startsWith('gsk_')) {
      return {
        client: new OpenAI({
          apiKey: groqKey,
          baseURL: 'https://api.groq.com/openai/v1',
          timeout: REQUEST_TIMEOUT_MS,
        }),
        model: 'llama-3.3-70b-versatile',
      };
    }

    if (openRouterKey && openRouterKey.startsWith('sk-or-v1-')) {
      return {
        client: new OpenAI({
          apiKey: openRouterKey,
          baseURL: 'https://openrouter.ai/api/v1',
          timeout: REQUEST_TIMEOUT_MS,
        }),
        model: 'meta-llama/llama-3.3-70b-instruct:free',
      };
    }

    // Default fallback to Groq or OpenRouter client
    return {
      client: new OpenAI({
        apiKey: groqKey || openRouterKey || 'dummy_key',
        baseURL: groqKey?.startsWith('gsk_') ? 'https://api.groq.com/openai/v1' : 'https://openrouter.ai/api/v1',
        timeout: REQUEST_TIMEOUT_MS,
      }),
      model: 'llama-3.3-70b-versatile',
    };
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const hash = crypto.createHash('sha256').update((systemPrompt || '') + prompt.trim()).digest('hex');

    if (this.cache.has(hash)) {
      return this.cache.get(hash)!;
    }

    try {
      const { client, model } = this.getClient();
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: 0.0,
      });

      const responseText = completion.choices[0]?.message?.content ?? '';

      if (responseText) {
        this.cache.set(hash, responseText);
      }

      return responseText;
    } catch (err) {
      console.error('LLM Service API Error:', err);
      throw err;
    }
  }
}