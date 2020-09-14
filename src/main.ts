import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

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
  await app.listen(4000, '0.0.0.0', (_, address) => log.log(`> ${address} ... ${process.env.NODE_ENV}`));
}
bootstrap();
