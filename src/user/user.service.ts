// src/user/user.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, User } from './models/user.model';
import { UserCredentials } from './models/user-credentials.model';
import {
  CreateOAuthProfileDto,
  DeleteEmailConfirmationTokenDto,
  DeletePasswordResetTokenDto,
  FindByEmailConfirmationTokenDto,
  FindByPasswordResetTokenDto,
  SaveEmailConfirmationTokenDto,
  SavePasswordResetTokenDto,
  UpdateUserDto,
} from './dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { OAuthProfile } from './models/oauth-profile.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(UserCredentials)
    private readonly userCredentialsModel: typeof UserCredentials,
    @InjectModel(OAuthProfile)
    private readonly oauthProfileModel: typeof OAuthProfile, // Внедрение новой зависимости
  ) {}

  //Создание функции для хеширования пароля
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  //Метод saveUser — сохранит нового пользователя
  async saveUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(dto.password);
    const user = await this.userModel.create({
      email: dto.email,
      username: dto.username,
      role: Role.USER,
    });

    await this.userCredentialsModel.create({
      userId: user.id,
      password: hashedPassword,
    });

    return user;
  }

  //Метод updateUser — обновление информации о пользователе
  async updateUser(userId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Обновляем только те поля, которые переданы в DTO
    if (dto.email) user.email = dto.email;
    if (dto.username) user.username = dto.username;
    if (dto.isEmailConfirmed) user.isEmailConfirmed = dto.isEmailConfirmed;

    await user.save();

    return user;
  }

  //Метод deleteUser — удаление пользователя
  async deleteUser(userId: string): Promise<void> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    await this.userCredentialsModel.destroy({ where: { userId } });
    await user.destroy();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({
      where: { email },
      include: [{ model: UserCredentials, as: 'credentials' }], // Загрузка связанных данных
    });
  }

  // Метод для получения пользователей по роли
  async changeUserRole(userId: string, newRole: Role): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (user.role === newRole) {
      throw new BadRequestException(`Пользователь уже имеет роль ${newRole}`);
    }

    user.role = newRole;
    await user.save();

    return user;
  }

  //Метод для смены роли пользователя
  async findUsersByRole(role: Role): Promise<User[]> {
    return await this.userModel.findAll({
      where: { role },
    });
  }

  //сохранения токена для email
  async saveEmailConfirmationToken(
    dto: SaveEmailConfirmationTokenDto,
  ): Promise<UserCredentials> {
    const userCredentials = await this.userCredentialsModel.findOne({
      where: { userId: dto.userId },
    });
    if (userCredentials) {
      userCredentials.emailConfirmationToken = dto.emailConfirmationToken;
      userCredentials.emailTokenExpiresAt = dto.emailTokenExpiresAt;
      return await userCredentials.save();
    }
    return await this.userCredentialsModel.create(dto);
  }

  //Метод для поиска токена подтверждения email
  async findByEmailConfirmationToken(
    dto: FindByEmailConfirmationTokenDto,
  ): Promise<UserCredentials> {
    return await this.userCredentialsModel.findOne({
      where: { emailConfirmationToken: dto.emailConfirmationToken },
    });
  }

  //Метод для удаления токена подтверждения email
  async deleteEmailConfirmationToken(
    dto: DeleteEmailConfirmationTokenDto,
  ): Promise<void> {
    await this.userCredentialsModel.update(
      { emailConfirmationToken: null, emailTokenExpiresAt: null }, // Удаляем только токен и дату его истечения
      { where: { emailConfirmationToken: dto.emailConfirmationToken } },
    );
  }

  //Метод для сохранения токена сброса пароля
  async savePasswordResetToken(dto: SavePasswordResetTokenDto): Promise<void> {
    const userCredentials = await this.userCredentialsModel.findOne({
      where: { userId: dto.userId },
    });

    if (!userCredentials) {
      throw new NotFoundException('Учетные данные пользователя не найдены');
    }

    // Обновляем только токен и время его истечения, не трогая поле password
    await userCredentials.update({
      passwordResetToken: dto.passwordResetToken,
      passwordResetExpires: dto.passwordResetExpires,
    });
  }

  //Метод для поиска токена сброса пароля
  async findByPasswordResetToken(
    dto: FindByPasswordResetTokenDto,
  ): Promise<UserCredentials> {
    return await this.userCredentialsModel.findOne({
      where: { passwordResetToken: dto.passwordResetToken },
    });
  }

  //Метод для удаления токена сброса пароля
  async deletePasswordResetToken(
    dto: DeletePasswordResetTokenDto,
  ): Promise<void> {
    await this.userCredentialsModel.update(
      { passwordResetToken: null, passwordResetExpires: null }, // Обнуляем только эти поля
      { where: { passwordResetToken: dto.passwordResetToken } },
    );
  }

  //Метод updateUserCredentials будет принимать идентификатор пользователя и объект с обновляемыми данными, после чего обновлять соответствующую запись в базе данных.
  async updateUserCredentials(
    userId: string,
    updateData: Partial<UserCredentials>,
  ): Promise<void> {
    const userCredentials = await this.userCredentialsModel.findOne({
      where: { userId },
    });

    if (!userCredentials) {
      throw new NotFoundException('Учетные данные пользователя не найдены');
    }

    // Обновляем только переданные данные
    await userCredentials.update(updateData);
  }

  //Метод для добавления OAuth-профиля
  async addOAuthProfile(dto: CreateOAuthProfileDto): Promise<OAuthProfile> {
    return await this.oauthProfileModel.create(dto);
  }
  //Метод для получения OAuth-профилей пользователя
  async getOAuthProfiles(userId: string): Promise<OAuthProfile[]> {
    return await this.oauthProfileModel.findAll({
      where: { userId },
    });
  }

  //Метод для удаления OAuth-профиля
  async deleteOAuthProfile(userId: string, provider: string): Promise<void> {
    await this.oauthProfileModel.destroy({
      where: { userId, provider },
    });
  }
}
