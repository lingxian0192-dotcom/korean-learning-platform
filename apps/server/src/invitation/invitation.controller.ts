import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('invitation')
@UseGuards(SupabaseGuard) // Require Login for all
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async generate(@Body() body: { count: number }, @Request() req) {
    return this.invitationService.generateCodes(body.count || 1, req.user.id);
  }

  @Post('redeem')
  async redeem(@Body() body: { code: string }, @Request() req) {
    return this.invitationService.redeemCode(body.code, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async list() {
    return this.invitationService.listCodes();
  }
}
