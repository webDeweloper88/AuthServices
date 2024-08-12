// src/user/dto/update-user-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../models/user.model';

export class UpdateUserRoleDto {
  @ApiProperty({ example: Role.ADMIN, description: 'Роль пользователя' })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
