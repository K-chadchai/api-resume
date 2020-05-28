import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';
import * as rateLimit from 'fastify-rate-limit';

const log = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }));
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(rateLimit, { windowMs: 1 * 60 * 1000, max: 100 });
  app.use(cookieParser());
  // app.use(csurf());
  app.enableCors();
  await app.listen(4000, '0.0.0.0', (_, address) => log.log(`> Authen is running ... ` + address));
}
bootstrap();
