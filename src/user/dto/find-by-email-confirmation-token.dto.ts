// src/user/dto/find-by-email-confirmation-token.dto.ts

import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindByEmailConfirmationTokenDto {
  @IsUUID('4', { message: 'Некорректный формат токена подтверждения email' })
  @IsNotEmpty({ message: 'Токен подтверждения email не должен быть пустым' })
  readonly emailConfirmationToken: string;
}
