import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { _AppName, _KafkaBrokers } from './app.constants';

const log = new Logger();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: { brokers: _KafkaBrokers },
      consumer: { groupId: `media` },
    },
  });
  await app.listenAsync();
  log.log(`[Ready] ${_AppName} `);
}
bootstrap();
