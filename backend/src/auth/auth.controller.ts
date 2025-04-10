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
} from '@nestjs/common';
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
    @Res() response: Response,
  ) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );
      if (!user) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const token = await this.authService.login(user.user);

      response.cookie('access_token', token.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      response
        .status(HttpStatus.OK)
        .json({ message: 'Logged in successfully' });
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
  @Patch('reset-password')
  async resetPassword(@Req() req, @Body() body: { newPassword: string }) {
    const access_token = req.cookies?.access_token;
    if (!access_token) {
      throw new BadRequestException('No session found');
    }

    const { data } = await this.authService.recovery_session(access_token);
    if (!data?.user) {
      throw new BadRequestException('Invalid token');
    }
    const updateResult = await this.authService.updatePasswordWithAccessToken(
      access_token,
      body.newPassword,
    );

    if (updateResult.error) {
      throw new BadRequestException(updateResult.error);
    }

    return { message: 'Password updated successfully' };
  }
  @Post('send-reset-password')
  async sendResetPassword(@Body() body: { email: string }) {
    return await this.authService.sendResetPassword(body.email);
  }
  @Post('recovery-session')
  async recovery_session(
    @Body() body: { access_token: string },
    @Res() response: Response,
  ) {
    const { access_token } = body;
    const { data, error } =
      await this.authService.recovery_session(access_token);
    if (!data || error) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 10 minutes
      path: '/',
    });

    // ✅ Send a response
    return response.status(200).json({
      message: 'Session started. You may now reset your password.',
      email: data.user.email,
      userId: data.user.id,
    });
  }

  @Post('checkUsername')
  async checkUsername(
    @Body() body: { username: string },
    @Res() response: Response,
  ) {
    const data = await this.authService.checkUsername(body.username);

    response.status(HttpStatus.OK).json(data.user);
  }
  @Post('signup')
  async signup(
    @Body() body: { username: string; email: string; password: string },
    @Res() response: Response,
  ) {
    try {
      const user = await this.authService.signup(
        body.username,
        body.email,
        body.password,
      );

      const token = await this.authService.login(user.user);

      response.cookie('access_token', token.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      response
        .status(HttpStatus.OK)
        .json({ message: 'sign up in successfully' });
    } catch (error) {
      throw new HttpException(
        error.message || 'signup failed',
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    try {
      // Clear the access_token cookie
      response.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return response
        .status(HttpStatus.OK)
        .json({ message: 'Logged out successfully' });
    } catch (error) {
      throw new HttpException(
        'Logout failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  async protectedRoute(@Req() request: Request) {
    if (!request.user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // Destructure to extract only necessary user details
    const { id, email, username } = request.user as any; // Adjust according to your user structure

    // Return the user details with a 200 OK status
    return {
      statusCode: HttpStatus.OK, // Explicit OK status
      message: 'Request successful',
      user: { id, email, username }, // Only returning necessary user info
    };
  }
}
