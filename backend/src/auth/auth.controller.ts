import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  HttpStatus,
  HttpException,
  Patch,
  BadRequestException,
  Get,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile';

// Extend the Request interface to include the user property
declare module 'express' {
  export interface Request {
    user?: { id: string; email: string }; // Adjust the type based on your user structure
  }
}
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../jwt-strategy/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string; rememberMe?: boolean },
    @Res() res: Response,
  ) {
    try {
      const { session } = await this.authService.login(
        body.email,
        body.password,
      );

      const user = session.user;
      const access_token = session.access_token;
      const refresh_token = session.refresh_token;

      // Set cookies
      const accessTokenMaxAge = 15 * 60 * 1000 * 100; // 15 minutes
      const refreshTokenMaxAge = body.rememberMe
        ? 30 * 24 * 60 * 60 * 1000
        : 1 * 24 * 60 * 60 * 1000; // 30 days or 1 day

      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: accessTokenMaxAge,
      });

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: refreshTokenMaxAge,
      });

      return res.status(HttpStatus.OK).json({
        user,
        access_token,
        refresh_token,
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid email or password',
      });
    }
  }

  @Post('signup')
  async signup(
    @Body()
    body: {
      username: string;
      email: string;
      password: string;
      lastName: string;
      firstName: string;
    },
    @Res() res: Response,
  ) {
    const user = await this.authService.signup(
      body.username,
      body.email,
      body.password,
      body.lastName,
      body.firstName,
    );
    const token = await this.authService.validateUser(user.user);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Signup successful', access_token: token.access_token });
  }

  @Post('refresh')
  async refreshToken(
    @Body() body: { refresh_token: string },
    @Res() res: Response,
  ) {
    if (!body.refresh_token) {
      throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.authService.refreshToken(body.refresh_token);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    return res.status(HttpStatus.OK).json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  }
  @Post('refresh-session')
  async refreshSession(@Body() { refresh_token }, @Res() res: Response) {
    if (!refresh_token) {
      throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.authService.refreshSession(refresh_token);

    return res.status(HttpStatus.OK).json(tokens);
  }

  @Post('login-with-google')
  async login_with_google(@Res() response: Response) {
    try {
      const { url } = await this.authService.login_with_google(); // Calls Supabase OAuth

      if (!url) {
        throw new HttpException(
          'Failed to retrieve Google login URL',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Redirect the user to Google's OAuth consent screen
      return response.status(HttpStatus.OK).json({ url });
    } catch (error) {
      throw new HttpException(
        error.message || 'Google OAuth login failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;

    const profile = await this.authService.getProfile(user.id);

    return res.status(HttpStatus.OK).json({ ...profile, ...user });
  }

  @Post('send-reset-password')
  async sendResetPassword(@Body() body: { email: string }) {
    return await this.authService.sendResetPassword(body.email);
  }
  @UseGuards(JwtAuthGuard)
  @Post('get-role')
  async getRole(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    return res.status(HttpStatus.OK).json({ ...user });
  }

  @Patch('reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @Req() req: Request,
    @Body() body: { newPassword: string },
  ) {
    const user = req.user as any;
    return await this.authService.updatePassword(user.sub, body.newPassword);
  }

  @Post('checkUsername')
  async checkUsername(
    @Body() body: { username: string },
    @Res() res: Response,
  ) {
    const data = await this.authService.checkUsername(body.username);
    res.status(HttpStatus.OK).json(data.user);
  }
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: Request, // The request object, which will contain the user
    @Body() updateProfileDto: any,
    @Res() res: Response,
  ) {
    try {
      const user = req.user as { id: string; email: string };
      if (!user) {
        throw new UnauthorizedException('No user found on request.');
      }

      const data = await this.authService.updateProfile(
        user.id,
        updateProfileDto,
      );
      res.status(HttpStatus.OK).json(data);
    } catch (err) {
      console.log(err);

      return res.status(HttpStatus.OK).json({
        statusCode: err.status || 500,
        message: err.message || 'An internal server error occurred.',
      });
    }
  }
}
