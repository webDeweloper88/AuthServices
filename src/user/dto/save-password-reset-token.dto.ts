// src/user/dto/save-password-reset-token.dto.ts

import { IsUUID, IsDate, IsNotEmpty } from 'class-validator';

export class SavePasswordResetTokenDto {
  @IsUUID('4', { message: 'Некорректный формат userId' })
  @IsNotEmpty({ message: 'userId не должен быть пустым' })
  readonly userId: string;

  @IsUUID('4', { message: 'Некорректный формат токена сброса пароля' })
  @IsNotEmpty({ message: 'Токен сброса пароля не должен быть пустым' })
  readonly passwordResetToken: string;

  @IsDate({ message: 'Дата истечения токена должна быть корректной датой' })
  @IsNotEmpty({ message: 'Дата истечения токена не должна быть пустой' })
  readonly passwordResetExpires: Date;
}
