import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const log = new Logger();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }));
  // Enable JWT
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // Enable Cors
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  });
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === 'development' || process.env.API_HOST?.includes('-uat')) {
    const options = new DocumentBuilder()
      .setTitle('Title : api-worker')
      .setDescription('Description : api-worker')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer(process.env.API_HOST)
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }

  const port = parseInt(process.env.API_PORT) || 4000;
  await app.listen(port, '0.0.0.0', (_, address) => log.log(`> ${address} ... ${process.env.NODE_ENV}`));
}
bootstrap();
