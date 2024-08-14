import {
  IsEmail,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Role } from '../models/user.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Новый email пользователя',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  readonly email?: string;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'Новое имя пользователя',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Username должен быть строкой' })
  readonly username?: string;

  @ApiProperty({
    example: 'user',
    description: 'Новая роль пользователя',
    enum: Role,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Роль должна быть либо "user", либо "admin"' })
  readonly role?: Role;

  @ApiProperty({
    example: true,
    description: 'Подтвержден ли email пользователя',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isEmailConfirmed должен быть булевым значением' })
  readonly isEmailConfirmed?: boolean;
}
