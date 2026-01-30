import { Module } from '@nestjs/common';
import { SrsService } from './srs.service';
import { SrsController } from './srs.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [SrsController],
  providers: [SrsService],
  exports: [SrsService],
})
export class SrsModule {}
