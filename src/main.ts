import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { QueryFailedErrorFilter } from './app/app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
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
