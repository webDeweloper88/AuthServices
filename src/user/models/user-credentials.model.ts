// src/user/models/user-credentials.model.ts
import { Column, DataType, ForeignKey, Model, Table, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'user_credentials',
})
export class UserCredentials extends Model<UserCredentials> {
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
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emailVerificationToken?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  passwordResetToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  passwordResetExpires?: Date;

  @BelongsTo(() => User)
  user: User;
}
