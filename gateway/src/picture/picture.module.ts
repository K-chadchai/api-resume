import { Module } from '@nestjs/common';
import { PictureController } from './picture.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { _KafkaBrokers } from 'src/app.constants';

@Module({
  controllers: [PictureController],
  imports: [
    ClientsModule.register([
      {
        name: `media.picture`,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: `media.picture`,
            brokers: _KafkaBrokers,
          },
          consumer: {
            groupId: `media.picture`,
          },
        },
      },
    ]),
  ],
})
export class PictureModule {}
