import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { _KafkaModule, _KafkaBrokers } from 'src/app.constants';

const kafkaName = _KafkaModule.users;

@Module({
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
  controllers: [UsersController],
})
export class UsersModule {}
