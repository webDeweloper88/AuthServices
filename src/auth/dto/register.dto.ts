// src/auth/dto/register.dto.ts

import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  readonly email: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Username не должен быть пустым' })
  readonly username?: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  readonly password: string;
}
