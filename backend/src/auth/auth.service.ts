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
  async login_with_google() {
    const { url } = await this.supabaseService.signInWithOAuth('google');

    if (!url) {
      throw new UnauthorizedException('Failed to get Google login URL');
    }

    return { url }; // Frontend should redirect to this URL
  }

  // auth.service.ts
  async updatePasswordWithAccessToken(
    access_token: string,
    newPassword: string,
  ) {
    const { data: userInfo, error } = await (
      await this.supabaseService.auth()
    ).getUser(access_token);
    if (error) throw new Error('Invalid or expired token');

    const userId = userInfo.user.id;

    const { error: updateError } = await (
      await this.supabaseService.auth()
    ).admin.updateUserById(userId, {
      password: newPassword,
    });

    if (updateError) throw new Error('Password change failed');

    return { userInfo, error };
  }
  async recovery_session(access_token: string) {
    const { data, error } = await (
      await this.supabaseService.auth()
    ).getUser(access_token);

    if (error) throw new Error('Invalid or expired token');

    return { data, error };
  }
  async sendResetPassword(email: string) {
    const { data, error } = await (
      await this.supabaseService.auth()
    ).resetPasswordForEmail(email);

    if (error) throw new Error('Error sending reset password email');

    return { data, error };
  }

  async signup(username: string, email: string, password: string) {
    const { user, session } = await this.supabaseService.signup(
      username,
      email,
      password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return { user, session };
  }
  async checkUsername(username: string) {
    const user = await this.supabaseService.checkUsername(username);

    return { user };
  }
}
