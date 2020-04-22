import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { _KafkaBrokers } from 'src/app.constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: `media.users`,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: `media.users`,
            brokers: _KafkaBrokers,
          },
          consumer: {
            groupId: `media.users`,
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
