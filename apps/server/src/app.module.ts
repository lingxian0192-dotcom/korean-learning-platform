import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ResourcesModule } from './resources/resources.module';
import { ProgressModule } from './progress/progress.module';
import { InvitationModule } from './invitation/invitation.module';
import { VocabModule } from './vocab/vocab.module';
import { SrsModule } from './srs/srs.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    SupabaseModule, 
    AuthModule, 
    ResourcesModule,
    ProgressModule,
    InvitationModule,
    VocabModule,
    SrsModule,
    AiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
