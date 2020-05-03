import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { _AppName } from './app.constants';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const log = new Logger();

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

  await app.listen(4000, () => log.log(`> ${_AppName}, Ready`));
}
bootstrap();
