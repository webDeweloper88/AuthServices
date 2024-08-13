// src/user/models/user.model.ts
import {
  Column,
  DataType,
  HasOne,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserCredentials } from './user-credentials.model';
import { OAuthProfile } from './oauth-profile.model';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  username?: string;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
    defaultValue: Role.USER, // Устанавливаем роль по умолчанию как 'user'
  })
  role: Role;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isEmailConfirmed: boolean;

  // Связи
  @HasOne(() => UserCredentials, { foreignKey: 'userId' })
  credentials: UserCredentials;

  @HasMany(() => OAuthProfile, { foreignKey: 'userId' })
  oauthProfiles: OAuthProfile[];
}
