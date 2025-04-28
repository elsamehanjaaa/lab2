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
      username: user.user_metadata?.full_name || '',
      email: user.email,
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
    return { url };
  }
  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          username: payload.username,
          email: payload.email,
        },
        { expiresIn: '15m' },
      );
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async updatePassword(userId: string, newPassword: string) {
    const { error } = await (
      await this.supabaseService.auth()
    ).admin.updateUserById(userId, { password: newPassword });

    if (error) throw new Error('Password change failed');
    return { message: 'Password updated successfully' };
  }

  async sendResetPassword(email: string) {
    const { error } = await (
      await this.supabaseService.auth()
    ).resetPasswordForEmail(email);

    if (error) throw new Error('Error sending reset password email');
    return { message: 'Reset password email sent successfully' };
  }

  async signup(username: string, email: string, password: string) {
    const { user } = await this.supabaseService.signup(
      username,
      email,
      password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return { user };
  }

  async checkUsername(username: string) {
    const user = await this.supabaseService.checkUsername(username);
    return { user };
  }
}
