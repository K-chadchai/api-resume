import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { QueryFailedErrorFilter } from './app/app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: false,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new QueryFailedErrorFilter());

  // const docbuilder = new DocumentBuilder()
  //   .setTitle('Files')
  //   .setDescription('API Service for file management')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, docbuilder);
  // SwaggerModule.setup('docs', app, document);

  await app.listen(4000);
}
bootstrap();
