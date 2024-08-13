// src/user/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SaveTokenDto {
  @IsString()
  readonly UserID: string;

  @IsString()
  readonly emailConfirmationToken: string;

  @IsString()
  readonly expiresAt: Date;
}

export class FindByTokenDto {
  @IsString()
  readonly emailConfirmationToken: string;
}

export class DeleteTokenDto {
  @IsString()
  readonly emailConfirmationToken: string;
}
