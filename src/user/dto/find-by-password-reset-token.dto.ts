// src/user/dto/find-by-password-reset-token.dto.ts

import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindByPasswordResetTokenDto {
  @IsUUID('4', { message: 'Некорректный формат токена сброса пароля' })
  @IsNotEmpty({ message: 'Токен сброса пароля не должен быть пустым' })
  readonly passwordResetToken: string;
}
