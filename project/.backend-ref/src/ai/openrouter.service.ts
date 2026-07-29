import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenRouterService {
  private client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  async generate(prompt: string) {
    const completion = await this.client.chat.completions.create({
      model: 'inclusionai/ling-3.0-flash:free',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  }
}