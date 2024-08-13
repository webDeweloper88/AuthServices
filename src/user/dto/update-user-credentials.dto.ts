// src/user/dto/update-user-credentials.dto.ts

import { IsOptional, IsString, IsDate, MinLength } from 'class-validator';

export class UpdateUserCredentialsDto {
  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Токен сброса пароля должен быть строкой' })
  passwordResetToken?: string;

  @IsOptional()
  @IsDate({
    message: 'Дата истечения токена сброса пароля должна быть корректной датой',
  })
  passwordResetExpires?: Date;

  @IsOptional()
  @IsString({ message: 'Токен подтверждения email должен быть строкой' })
  emailConfirmationToken?: string;

  @IsOptional()
  @IsDate({
    message:
      'Дата истечения токена подтверждения email должна быть корректной датой',
  })
  emailTokenExpiresAt?: Date;
}
