import { Module } from '@nestjs/common';
import { PictureController } from './picture.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { _KafkaBrokers, _KafkaModule } from 'src/app.constants';

@Module({
  controllers: [PictureController],
  imports: [
    ClientsModule.register([
      {
        name: _KafkaModule.picture,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: _KafkaModule.picture,
            brokers: _KafkaBrokers,
          },
          consumer: {
            groupId: _KafkaModule.picture,
          },
        },
      },
    ]),
  ],
})
export class PictureModule {}
