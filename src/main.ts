import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const log = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000, '0.0.0.0', (_, address) => log.log(`> Authen is running ... ` + address));
}
bootstrap();
