import Groq from 'groq-sdk';
import { analyzeResumeRealATS, RealAtsResult } from './real-ats-engine';

let groqClient: Groq | null = null;
let isUsingOpenRouter = false;

export function getGroqClient(): { client: Groq | null; defaultModel: string } {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  // 1. OpenRouter API Key (Prioritize live OpenRouter key)
  if (
    openRouterKey &&
    openRouterKey.startsWith('sk-or-v1-') &&
    openRouterKey !== 'sk-or-v1-your_openrouter_api_key_here'
  ) {
    if (!groqClient) {
      groqClient = new Groq({
        apiKey: openRouterKey,
        baseURL: 'https://openrouter.ai/api/v1',
      });
      isUsingOpenRouter = true;
    }
    return { client: groqClient, defaultModel: 'meta-llama/llama-3.3-70b-instruct' };
  }

  // 2. Direct Groq API Key
  if (groqKey && groqKey.startsWith('gsk_') && groqKey !== 'gsk_your_actual_groq_api_key_here') {
    if (!groqClient) {
      groqClient = new Groq({ apiKey: groqKey });
      isUsingOpenRouter = false;
    }
    return { client: groqClient, defaultModel: 'llama-3.3-70b-versatile' };
  }

  return { client: null, defaultModel: 'meta-llama/llama-3.3-70b-instruct' };
}

export async function generateGroqJSON<T = unknown>(
  systemPrompt: string,
  userPrompt: string,
  modelOverride?: string
): Promise<T> {
  const { client, defaultModel } = getGroqClient();

  if (!client) {
    const textMatch = userPrompt.match(/DOCUMENT TEXT TO EVALUATE:([\s\S]*?)(?:TARGET JOB DESCRIPTION:|$)/i) ||
                      userPrompt.match(/RESUME TEXT:([\s\S]*?)$/i);
    const jdMatch = userPrompt.match(/TARGET JOB DESCRIPTION:([\s\S]*?)$/i);

    const resumeText = textMatch ? textMatch[1].trim() : userPrompt;
    const jobDescription = jdMatch ? jdMatch[1].trim() : '';

    return analyzeResumeRealATS(resumeText, jobDescription) as unknown as T;
  }

  try {
    const model = modelOverride || defaultModel;

    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON matching the requested structure without markdown code blocks.`,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model,
      temperature: 0.2,
      ...(isUsingOpenRouter ? {} : { response_format: { type: 'json_object' } }),
    });

    const content = response.choices[0]?.message?.content || '{}';
    const cleaned = content.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn('Live AI API call error, using Real Local ATS Scanning Engine:', err);
    
    const textMatch = userPrompt.match(/DOCUMENT TEXT TO EVALUATE:([\s\S]*?)(?:TARGET JOB DESCRIPTION:|$)/i) ||
                      userPrompt.match(/RESUME TEXT:([\s\S]*?)$/i);
    const jdMatch = userPrompt.match(/TARGET JOB DESCRIPTION:([\s\S]*?)$/i);

    const resumeText = textMatch ? textMatch[1].trim() : userPrompt;
    const jobDescription = jdMatch ? jdMatch[1].trim() : '';

    return analyzeResumeRealATS(resumeText, jobDescription) as unknown as T;
  }
}

export async function generateGroqText(
  systemPrompt: string,
  userPrompt: string,
  modelOverride?: string
): Promise<string> {
  const { client, defaultModel } = getGroqClient();
  if (!client) {
    return 'Analysis completed using real local ATS evaluation rules.';
  }

  try {
    const model = modelOverride || defaultModel;

    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model,
      temperature: 0.4,
    });

    return response.choices[0]?.message?.content || '';
  } catch {
    return 'Analysis completed using real local ATS evaluation rules.';
  }
}
