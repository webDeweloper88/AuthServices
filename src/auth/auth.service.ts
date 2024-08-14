// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/models/user.model';
import { MailService } from '../mail/mail.service';
import { v4 as UUIDV4 } from 'uuid';
import { addMinutes } from 'date-fns';
import { LoginDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  //метод регистрация user
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, username } = registerDto;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const user = await this.userService.saveUser({
      email,
      username,
      password, // Передаем чистый пароль
    });

    const emailConfirmationToken = UUIDV4();
    const expiresAt = addMinutes(new Date(), 10);

    await this.userService.saveEmailConfirmationToken({
      userId: user.id,
      emailConfirmationToken,
      emailTokenExpiresAt: expiresAt,
    });

    // Отправка email с подтверждением
    await this.mailService.sendVerificationEmail(
      user.email,
      emailConfirmationToken,
    );
    return user;
  }
  //метод потверждения почта (после 10 минут истекает срок токена)
  async confirmEmail(token: string): Promise<void> {
    const userCredentials = await this.userService.findByEmailConfirmationToken(
      { emailConfirmationToken: token },
    );

    if (!userCredentials || userCredentials.emailTokenExpiresAt < new Date()) {
      throw new BadRequestException('Токен недействителен или истек');
    }

    // Обновляем поле isEmailConfirmed в сущности User
    await this.userService.updateUser(userCredentials.userId, {
      isEmailConfirmed: true,
    });
    // Удаляем токен после успешного подтверждения
    await this.userService.deleteEmailConfirmationToken({
      emailConfirmationToken: token,
    });
  }
  //Метод для генереция новый токена (после успешно генерация удаляет старый токена)
  async regenerateTokenIfExpired(token: string): Promise<void> {
    const userCredentials = await this.userService.findByEmailConfirmationToken(
      { emailConfirmationToken: token },
    );

    if (!userCredentials) {
      throw new BadRequestException('Токен не найден');
    }

    if (userCredentials.emailTokenExpiresAt < new Date()) {
      // Удаляем старый токен
      await this.userService.deleteEmailConfirmationToken({
        emailConfirmationToken: token,
      });

      // Генерируем новый токен
      const newToken = UUIDV4();
      const expiresAt = addMinutes(new Date(), 10);

      await this.userService.saveEmailConfirmationToken({
        userId: userCredentials.userId,
        emailConfirmationToken: newToken,
        emailTokenExpiresAt: expiresAt,
      });

      // Получаем пользователя для отправки email
      const user = await this.userService.findOneById(userCredentials.userId);

      // Отправляем письмо с новым токеном
      await this.mailService.sendVerificationEmail(user.email, newToken);
    } else {
      throw new BadRequestException('Токен еще действителен');
    }
  }

  //Метод логин (Возврашаем accessToken)
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Ищем пользователя по email
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Некорректный email или пароль');
    }

    // Проверяем, совпадает ли пароль
    const isPasswordValid = await bcrypt.compare(
      password,
      user.credentials.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Некорректный email или пароль');
    }

    // Генерация JWT-токена
    const payload = { userId: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
  // метод запрос на изменения паспорта
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден');
    }

    const token = UUIDV4();
    const expiresAt = addMinutes(new Date(), 10);

    await this.userService.savePasswordResetToken({
      userId: user.id,
      passwordResetToken: token,
      passwordResetExpires: expiresAt,
    });

    await this.mailService.sendPasswordResetEmail(user.email, token);
  }

  //Метод ресет паспорт
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userCredentials = await this.userService.findByPasswordResetToken({
      passwordResetToken: token,
    });

    if (!userCredentials || userCredentials.passwordResetExpires < new Date()) {
      throw new BadRequestException('Токен недействителен или истек');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUserCredentials(userCredentials.userId, {
      password: hashedPassword,
    });
    await this.userService.deletePasswordResetToken({
      passwordResetToken: token,
    });
  }
}
