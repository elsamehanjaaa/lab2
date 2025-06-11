import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProfileDto } from './dto/update-profile';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const { user, session } = await this.supabaseService.signIn(
      email,
      password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return { session };
  }

  async validateUser(user: any) {
    const payload = {
      sub: user.id,
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
      const { data, error } = await (
        await this.supabaseService.auth()
      ).refreshSession({
        refresh_token: refreshToken,
      });
      if (error) {
        console.log(error);
      }
      return {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refreshSession(refresh_token: string) {
    try {
      const auth = await this.supabaseService.auth();
      const { data, error } = await auth.refreshSession({ refresh_token });
      if (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return data;
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

  async signup(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const { user } = await this.supabaseService.signup(
      username,
      email,
      password,
      firstName,
      lastName,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return { user };
  }

  async checkUsername(username: string) {
    const user = await this.supabaseService.checkUsername(username);
    return { user };
  }
  async getProfile(id: string) {
    const user = await this.supabaseService.getDataById('profiles', id);
    return user[0];
  }
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const { data } = await this.supabaseService.updateData(
      'profiles',
      updateProfileDto,
      id,
    );

    return data[0];
  }
}
