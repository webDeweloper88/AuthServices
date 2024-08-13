// src/auth/dto/resend-email-confirmation.dto.ts

import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendEmailConfirmationDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  readonly email: string;
}
