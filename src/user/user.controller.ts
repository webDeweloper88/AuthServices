import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User } from './models/user.model';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateOAuthProfileDto, UpdateUserDto } from './dto';
import { OAuthProfile } from './models/oauth-profile.model';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 1. Получение всех пользователей
  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список всех пользователей',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // 2. Получение пользователя по ID
  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Пользователь найден', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOneById(id);
  }

  // 3. Создание нового пользователя
  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.saveUser(createUserDto);
  }

  // 4. Обновление информации о пользователе
  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Данные пользователя успешно обновлены',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  // 5. Удаление пользователя
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  // 6. Изменение роли пользователя
  @Put(':id/role')
  @ApiOperation({ summary: 'Изменить роль пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Роль пользователя успешно изменена',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          example: 'admin', // Пример значения для поля role
          description:
            'Роль, которую вы хотите назначить пользователю (например, "user" или "admin")',
        },
      },
    },
  })
  async changeRole(
    @Param('id') id: string,
    @Body('role') role: Role,
  ): Promise<User> {
    return this.userService.changeUserRole(id, role);
  }

  // 7. Добавление OAuth-профиля
  @Post(':id/oauth')
  @ApiOperation({ summary: 'Добавить OAuth-профиль пользователю' })
  @ApiResponse({
    status: 201,
    description: 'OAuth-профиль успешно добавлен',
    type: OAuthProfile,
  })
  @Post(':id/oauth')
  @ApiOperation({ summary: 'Добавить OAuth-профиль пользователю' })
  @ApiResponse({
    status: 201,
    description: 'OAuth-профиль успешно добавлен',
    type: OAuthProfile,
  })
  async addOAuthProfile(
    @Param('id') id: string,
    @Body() createOAuthProfileDto: CreateOAuthProfileDto,
  ): Promise<OAuthProfile> {
    // Передаем userId напрямую в метод сервиса
    return this.userService.addOAuthProfile({
      ...createOAuthProfileDto,
      userId: id,
    });
  }

  // 8. Получение OAuth-профилей пользователя
  @Get(':id/oauth')
  @ApiOperation({ summary: 'Получить OAuth-профили пользователя' })
  @ApiResponse({
    status: 200,
    description: 'OAuth-профили успешно получены',
    type: [OAuthProfile],
  })
  async getOAuthProfiles(@Param('id') id: string): Promise<OAuthProfile[]> {
    return this.userService.getOAuthProfiles(id);
  }

  // 9. Удаление OAuth-профиля
  @Delete(':id/oauth/:provider')
  @ApiOperation({ summary: 'Удалить OAuth-профиль пользователя' })
  @ApiResponse({ status: 200, description: 'OAuth-профиль успешно удален' })
  async deleteOAuthProfile(
    @Param('id') id: string,
    @Param('provider') provider: string,
  ): Promise<void> {
    return this.userService.deleteOAuthProfile(id, provider);
  }
}
