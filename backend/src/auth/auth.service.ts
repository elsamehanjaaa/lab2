import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const { user, session } = await this.supabaseService.signIn(
      email,
      password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return { user, session };
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.user_metadata.full_name,
      email: user.user_metadata.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
