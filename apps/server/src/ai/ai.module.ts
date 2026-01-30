import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SupabaseModule, SettingsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
