import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/User.model';
import { UserCredentials } from './models/user-credentials.model';
import { OAuthProfile } from './models/oauth-profile.model';


@Module({
  imports:[SequelizeModule.forFeature([User, UserCredentials, OAuthProfile])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
