import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { InvitedGuard } from '../auth/invited.guard';

@Controller('ai')
@UseGuards(SupabaseGuard, InvitedGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Request() req, @Body() body: { message: string }) {
    return this.aiService.chat(req.user.id, body.message);
  }
}
