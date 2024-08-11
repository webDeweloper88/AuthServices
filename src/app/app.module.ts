import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from '@config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], // Загружает вашу конфигурацию
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
             return{
          dialect: 'postgres',
          host: configService.get<string>('db_host'),
          port: configService.get<number>('db_port'),
          username: configService.get<string>('db_user'),
          password: configService.get<string>('db_password'),
          database: configService.get<string>('db_name'),
          autoLoadModels: true,
          synchronize: true,
        }
       
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
