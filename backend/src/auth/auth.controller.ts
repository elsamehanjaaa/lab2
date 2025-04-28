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
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

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
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const token = await this.authService.login(user.user);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(HttpStatus.OK).json({
      message: 'Logged in successfully',
      access_token: token.access_token,
    });
  }

  @Post('signup')
  async signup(
    @Body() body: { username: string; email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.signup(
      body.username,
      body.email,
      body.password,
    );
    const token = await this.authService.login(user.user);

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
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies?.refresh_token;
    if (!refresh_token) {
      throw new HttpException(
        'Refresh token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokens = await this.authService.refreshToken(refresh_token);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res
      .status(HttpStatus.OK)
      .json({ access_token: tokens.access_token });
  }
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
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
    return res.status(HttpStatus.OK).json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  @Post('send-reset-password')
  async sendResetPassword(@Body() body: { email: string }) {
    return await this.authService.sendResetPassword(body.email);
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
}
