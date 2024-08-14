// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';
import { User } from '../../user/models/user.model';

interface JwtPayload {
  username: string;
  sub: string; // Это будет userId
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка Authorization
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'yourSecretKey', // Секретный ключ для валидации токена
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // Возвращаем пользователя, если токен валиден
  }
}
