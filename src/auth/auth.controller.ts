import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/models/user.model';
import { LoginDto, RegisterResponseDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    const user = await this.authService.register(registerDto);

    // Создаем и возвращаем объект RegisterResponseDto
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isEmailConfirmed: user.isEmailConfirmed,
    };
  }

  @Get('confirm-email')
  @ApiOperation({ summary: 'Подтверждение email' })
  @ApiResponse({ status: 200, description: 'Email успешно подтвержден' })
  @ApiResponse({ status: 400, description: 'Токен недействителен или истек' })
  async confirmEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Токен не передан');
    }

    await this.authService.confirmEmail(token);

    return { message: 'Email успешно подтвержден' };
  }

  @Post('regenerate-token')
  @ApiOperation({ summary: 'Регенерация токена и отправка нового на email' })
  @ApiResponse({
    status: 200,
    description: 'Новый токен сгенерирован и отправлен на email',
  })
  @ApiResponse({
    status: 400,
    description: 'Токен не найден или еще действителен',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'старый_токен', // Пример значения токена
          description:
            'Токен, который нужно проверить и при необходимости заменить',
        },
      },
    },
  })
  async regenerateToken(
    @Body('token') token: string,
  ): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Токен не передан');
    }

    await this.authService.regenerateTokenIfExpired(token);

    return { message: 'Новый токен сгенерирован и отправлен на ваш email' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно вошел в систему',
    schema: { example: { accessToken: 'jwt-token' } },
  })
  @ApiResponse({ status: 401, description: 'Некорректный email или пароль' })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Запрос на восстановление пароля' })
  @ApiResponse({
    status: 200,
    description: 'Токен для восстановления пароля отправлен на email',
  })
  @ApiResponse({
    status: 400,
    description: 'Пользователь с таким email не найден',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
          description:
            'Email пользователя, для которого запрашивается восстановление пароля',
        },
      },
    },
  })
  async requestPasswordReset(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException('Email не передан');
    }

    await this.authService.requestPasswordReset(email);

    return {
      message: 'Токен для восстановления пароля отправлен на ваш email',
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Сброс пароля' })
  @ApiResponse({ status: 200, description: 'Пароль успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Токен недействителен или истек' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'password-reset-token',
          description: 'Токен для сброса пароля',
        },
        newPassword: {
          type: 'string',
          example: 'newpassword',
          description: 'Новый пароль',
        },
      },
    },
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    if (!token || !newPassword) {
      throw new BadRequestException(
        'Токен и новый пароль должны быть переданы',
      );
    }

    await this.authService.resetPassword(token, newPassword);

    return { message: 'Пароль успешно обновлен' };
  }
}
