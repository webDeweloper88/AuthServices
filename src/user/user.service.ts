// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, Role } from './models/User.model';
import { UserCredentials } from './models/user-credentials.model';
import { OAuthProfile } from './models/oauth-profile.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(UserCredentials)
    private userCredentialsModel: typeof UserCredentials,
    @InjectModel(OAuthProfile)
    private oauthProfileModel: typeof OAuthProfile,
  ) {}

   // Обновление роли пользователя
   async updateRole(userId: string, role: Role): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    await user.save();
    return user;
  }

  // Создание пользователя
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create({ ...createUserDto, role: Role.USER });
    return user;
  }

  // Получение всех пользователей
  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      include: [UserCredentials, OAuthProfile],
    });
  }

  // Получение пользователя по ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      include: [UserCredentials, OAuthProfile],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Обновление данных пользователя
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    await user.update(updateUserDto);
    return user;
  }

  // Удаление пользователя
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  // Создание учетных данных пользователя (UserCredentials)
  async createCredentials(userId: string, password: string): Promise<UserCredentials> {
    const credentials = await this.userCredentialsModel.create({ userId, password });
    return credentials;
  }

  // Обновление учетных данных пользователя
  async updateCredentials(userId: string, password: string): Promise<UserCredentials> {
    const credentials = await this.userCredentialsModel.findOne({ where: { userId } });
    if (!credentials) {
      throw new NotFoundException('User credentials not found');
    }
    await credentials.update({ password });
    return credentials;
  }

  // Создание OAuth профиля
  async createOAuthProfile(userId: string, provider: string, providerId: string, accessToken: string, refreshToken?: string): Promise<OAuthProfile> {
    const profile = await this.oauthProfileModel.create({ userId, provider, providerId, accessToken, refreshToken });
    return profile;
  }

  // Обновление OAuth профиля
  async updateOAuthProfile(userId: string, provider: string, accessToken: string, refreshToken?: string): Promise<OAuthProfile> {
    const profile = await this.oauthProfileModel.findOne({ where: { userId, provider } });
    if (!profile) {
      throw new NotFoundException('OAuth profile not found');
    }
    await profile.update({ accessToken, refreshToken });
    return profile;
  }
 }
