import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const docbuilder = new DocumentBuilder()
    .setTitle('Files')
    .setDescription('API Service for file management')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, docbuilder);
  SwaggerModule.setup('docs', app, document);

  await app.listen(4000);
}
bootstrap();
