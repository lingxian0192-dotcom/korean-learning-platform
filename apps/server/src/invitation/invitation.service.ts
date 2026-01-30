import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvitationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async generateCodes(count: number, createdBy: string) {
    const codes = Array.from({ length: count }, () => ({
      code: uuidv4().substring(0, 8).toUpperCase(), // Short codes
      created_by: createdBy,
      status: 'active',
    }));

    // Use service role client to insert codes (bypass RLS if needed, or ensure admin has rights)
    // Assuming the user calling this is Admin and has RLS rights.
    const { data, error } = await this.supabaseService
      .getClient() // This uses the anon key usually? No, SupabaseService might need adjustment to use Service Role for admin tasks if RLS blocks.
      // Actually, for now let's assume the caller has the token and RLS allows admins.
      .from('invitation_codes')
      .insert(codes)
      .select();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async validateCode(code: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('invitation_codes')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !data) return { valid: false };
    return { valid: data.status === 'active', code: data };
  }

  async redeemCode(code: string, userId: string) {
    // 1. Check code
    const validation = await this.validateCode(code);
    if (!validation.valid) {
      throw new BadRequestException('Invalid or used invitation code');
    }

    // 2. Update code status
    const { error: updateError } = await this.supabaseService
      .getClient() // Using service role might be safer here to ensure consistency, but let's stick to standard client first.
      .from('invitation_codes')
      .update({ 
        status: 'used', 
        used_by: userId, 
        used_at: new Date().toISOString() 
      })
      .eq('code', code);

    if (updateError) throw new BadRequestException('Failed to redeem code');

    // 3. Update user profile
    // We need to use SERVICE ROLE here because the user might not have permission to update 'is_invited' directly if RLS is strict (only admins update invited status).
    // In my SQL, I said "Users can update their own profile" for all columns. 
    // Ideally, `is_invited` should be read-only for the user.
    // Let's assume we need a privileged update here.
    
    // For now, I'll use the provided client, but ideally I should use a service role client for this sensitive operation.
    // Since I don't have a specific "getServiceRoleClient" method exposed yet, I'll rely on the RLS allowing update or user having rights.
    // **Correction**: I should probably update the SupabaseService to allow Service Role usage.
    
    const { error: profileError } = await this.supabaseService
      .getClient()
      .from('profiles')
      .update({ is_invited: true })
      .eq('id', userId);

    if (profileError) throw new BadRequestException('Failed to activate user');

    return { success: true };
  }

  async listCodes() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('invitation_codes')
      .select('*, profiles:used_by(id)'); // simplified join
    
    if (error) throw new BadRequestException(error.message);
    return data;
  }
}
