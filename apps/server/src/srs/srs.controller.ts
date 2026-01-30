import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SrsService } from './srs.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { InvitedGuard } from '../auth/invited.guard';

@Controller('srs')
@UseGuards(SupabaseGuard, InvitedGuard)
export class SrsController {
  constructor(private readonly srsService: SrsService) {}

  @Get('due')
  getDue(@Request() req) {
    return this.srsService.getDueItems(req.user.id);
  }

  @Post('review')
  review(@Request() req, @Body() body: { vocabId: string; quality: number }) {
    return this.srsService.reviewItem(req.user.id, body.vocabId, body.quality);
  }
  
  @Post('add')
  addToReview(@Request() req, @Body() body: { vocabIds: string[] }) {
      return this.srsService.addItemsToReview(req.user.id, body.vocabIds);
  }
}
