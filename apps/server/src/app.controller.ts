import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('debug-env')
  debugEnv() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    let keyRole = 'Unknown';
    if (supabaseKey) {
      try {
        const payload = JSON.parse(atob(supabaseKey.split('.')[1]));
        keyRole = payload.role || 'Unknown';
      } catch (e) {
        keyRole = 'Invalid JWT';
      }
    }

    return {
      status: 'Debug',
      env: {
        SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
        SUPABASE_KEY_SET: !!supabaseKey,
        SUPABASE_KEY_ROLE: keyRole,
        PORT: process.env.PORT || 'Not Set (Defaulting)',
      },
    };
  }
}
