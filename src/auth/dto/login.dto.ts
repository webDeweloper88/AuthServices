import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  readonly email: string;

  @ApiProperty({ example: 'password', description: 'Пароль пользователя' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  readonly password: string;
}
