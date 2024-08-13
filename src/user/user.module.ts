import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserCredentials } from './models/user-credentials.model';
import { OAuthProfile } from './models/oauth-profile.model';

@Module({
  imports: [SequelizeModule.forFeature([User, UserCredentials, OAuthProfile])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
