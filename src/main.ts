import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get<ConfigService>(ConfigService);

  app.use(
    '/api/docs*',
    basicAuth({
      challenge: true,
      users: {
        admin: config.get('DOCS_PASS'),
      },
    }),
  );

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const documentation = new DocumentBuilder()
    .setTitle('Budget Tracker')
    .setDescription(' Documentation for the budget tracker!')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentation);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.get('PORT'), () => {
    console.log(`Application is running on port ${config.get('PORT')}`);
    console.log(
      `For documentation http://localhost:${config.get('PORT')}/api/docs `,
    );
  });
}
bootstrap();
