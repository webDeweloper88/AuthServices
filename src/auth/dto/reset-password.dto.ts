// src/auth/dto/reset-password.dto.ts

import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Токен не должен быть пустым' })
  readonly token: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  readonly newPassword: string;
}
