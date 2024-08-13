// src/user/dto/delete-email-confirmation-token.dto.ts

import { IsUUID, IsNotEmpty } from 'class-validator';

export class DeleteEmailConfirmationTokenDto {
  @IsUUID('4', { message: 'Некорректный формат токена подтверждения email' })
  @IsNotEmpty({ message: 'Токен подтверждения email не должен быть пустым' })
  readonly emailConfirmationToken: string;
}
