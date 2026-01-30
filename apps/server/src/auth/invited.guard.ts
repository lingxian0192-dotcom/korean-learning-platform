import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class InvitedGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) return false; // Should be handled by SupabaseGuard

    const { data: profile, error } = await this.supabaseService
      .getClient(request.token)
      .from('profiles')
      .select('is_invited')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      // If profile doesn't exist, they are definitely not invited/setup
      throw new ForbiddenException('Profile not found');
    }

    if (!profile.is_invited) {
      throw new ForbiddenException('Invitation required');
    }

    return true;
  }
}
