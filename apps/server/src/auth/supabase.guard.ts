import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    // Verify token with Supabase
    const { data: { user }, error } = await this.supabaseService
      .getClient(token)
      .auth.getUser();

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Attach user and token to request
    request.user = user;
    request.token = token;

    return true;
  }
}
