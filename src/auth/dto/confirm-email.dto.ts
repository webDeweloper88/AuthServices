// src/auth/dto/confirm-email.dto.ts

import { IsUUID, IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
  @IsUUID('4', { message: 'Некорректный формат токена' })
  @IsNotEmpty({ message: 'Токен не должен быть пустым' })
  readonly token: string;
}
