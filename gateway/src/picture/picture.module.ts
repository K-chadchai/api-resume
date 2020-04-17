import { Module } from '@nestjs/common';
import { PictureController } from './picture.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { _KafkaBrokers, _KafkaModule } from 'src/app.constants';

const kafkaName = _KafkaModule.picture;

@Module({
  controllers: [PictureController],
  imports: [
    ClientsModule.register([
      {
        name: kafkaName,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: kafkaName,
            brokers: _KafkaBrokers,
          },
          consumer: {
            groupId: kafkaName,
          },
        },
      },
    ]),
  ],
})
export class PictureModule {}
