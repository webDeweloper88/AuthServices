// src/user/models/oauth-profile.model.ts
import { Column, DataType, ForeignKey, Model, Table, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'oauth_profiles',
})
export class OAuthProfile extends Model<OAuthProfile> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  provider: string; // Например, 'google', 'facebook'

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  providerId: string; // Идентификатор пользователя в сервисе OAuth

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  accessToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refreshToken?: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date;

  // Связь с пользователем
  @BelongsTo(() => User)
  user: User;
}
