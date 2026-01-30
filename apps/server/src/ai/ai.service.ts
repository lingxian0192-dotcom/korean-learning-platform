import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { SettingsService } from '../settings/settings.service';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly deepSeekUrl = 'https://api.deepseek.com/chat/completions';
  private readonly systemPrompt = `
You are a dedicated Korean language learning assistant for LingKR HUB.
Your role is to help users learn Korean vocabulary, grammar, pronunciation, and culture.
Rules:
1. ONLY answer questions related to Korean language learning.
2. If a user asks about coding, math, general knowledge, or anything else, politely refuse in Korean and English, saying "I can only help with Korean learning."
3. Be encouraging and helpful.
4. Provide examples in Hangul and Romanization if needed.
`;

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
    private readonly settingsService: SettingsService
  ) {}

  async chat(userId: string, message: string) {
    // 1. Check Usage Limit (Simple Daily Limit)
    // For now, let's just log and check total.
    // Real implementation would sum tokens for today.
    
    // 2. Call DeepSeek
    const apiKey = await this.settingsService.getApiKey();
    if (!apiKey) {
      // Return a mock response if no key configured (for demo stability)
      return { 
        content: "DeepSeek API Key is missing. Please configure DEEPSEEK_API_KEY in the server environment or Admin Panel. (Mock Response: 안녕하세요! How can I help you with Korean today?)" 
      };
    }

    try {
      const response = await axios.post(
        this.deepSeekUrl,
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      const tokens = response.data.usage?.total_tokens || 0;

      // 3. Log Usage
      await this.supabaseService
        .getClient()
        .from('api_usage_logs')
        .insert({
          user_id: userId,
          tokens_used: tokens,
          endpoint: 'chat',
        });

      return { content: reply };

    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to communicate with AI service');
    }
  }
}
