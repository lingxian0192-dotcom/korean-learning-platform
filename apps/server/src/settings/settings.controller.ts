import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('settings')
@UseGuards(SupabaseGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('api-key')
  @Roles('admin')
  async getApiKey() {
    const key = await this.settingsService.getApiKey();
    // Return masked key or empty
    return { apiKey: key ? '********' + key.slice(-4) : '' };
  }

  @Post('api-key')
  @Roles('admin')
  async setApiKey(@Body('apiKey') apiKey: string) {
    await this.settingsService.setApiKey(apiKey);
    return { success: true };
  }
}
