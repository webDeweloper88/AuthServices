// src/user/dto/save-email-confirmation-token.dto.ts

import { IsUUID, IsDate, IsNotEmpty } from 'class-validator';

export class SaveEmailConfirmationTokenDto {
  @IsUUID('4', { message: 'Некорректный формат userId' })
  @IsNotEmpty({ message: 'userId не должен быть пустым' })
  readonly userId: string;

  @IsUUID('4', { message: 'Некорректный формат токена подтверждения email' })
  @IsNotEmpty({ message: 'Токен подтверждения email не должен быть пустым' })
  readonly emailConfirmationToken: string;

  @IsDate({ message: 'Дата истечения токена должна быть корректной датой' })
  @IsNotEmpty({ message: 'Дата истечения токена не должна быть пустой' })
  readonly emailTokenExpiresAt: Date;
}
