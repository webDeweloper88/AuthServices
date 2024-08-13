import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Настройка CORS
  app.enableCors({
    origin:
      configService.get<string>('APP_URL_FRONT') || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users') // Добавление тега 'users' в описание документа
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  // console.log(`Application is running on: ${await app.getUrl()}`);
  // console.log(
  //   `Swagger documentation is available at: ${await app.getUrl()}/api`,
  // );
}

bootstrap();
