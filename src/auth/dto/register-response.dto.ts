import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: 'user-id-uuid',
    description: 'Уникальный идентификатор пользователя',
  })
  readonly id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  readonly email: string;

  @ApiProperty({
    example: 'TestUser',
    description: 'Имя пользователя',
    required: false,
  })
  readonly username?: string;

  @ApiProperty({ example: 'user', description: 'Роль пользователя' })
  readonly role: string;

  @ApiProperty({
    example: false,
    description: 'Подтвержден ли email пользователя',
  })
  readonly isEmailConfirmed: boolean;
}
