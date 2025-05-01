// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ REQUIRED
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // ✅ Must match token-signing secret
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username || payload.user_metadata?.full_name,
      role: payload.app_metadata.role || payload.user_metadata?.role,
    };
  }
}
