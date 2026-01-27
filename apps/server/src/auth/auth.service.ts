import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signUp(authDto: AuthDto) {
    const { email, password, name } = authDto;
    
    // 1. Sign up with Supabase Auth
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email,
        password,
        options: {
          data: { name }, // Metadata
        },
      });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    // 2. Sync with local users table (if trigger not set up)
    // Ideally, use a Supabase Database Trigger. 
    // For now, we'll assume the trigger handles it or we rely on Auth User.
    // But our architecture has a 'users' table.
    // Let's manually insert to ensure consistency if trigger is missing.
    if (data.user) {
      const { error: dbError } = await this.supabaseService
        .getClient()
        .from('users')
        .insert({
          id: data.user.id, // Sync ID
          email: data.user.email,
          name: name || 'User',
          password_hash: 'MANAGED_BY_SUPABASE', // Placeholder
        })
        .select()
        .single();
        
       // If insert fails (e.g. duplicate), it might be handled by trigger, so we ignore duplicate error
    }

    return { message: 'User registered successfully', user: data.user };
  }

  async signIn(authDto: AuthDto) {
    const { email, password } = authDto;

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    };
  }
}
