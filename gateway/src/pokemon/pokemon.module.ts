import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { _KafaModule, _KafkaBrokers } from 'src/app.constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

const _kafkaName = _KafaModule.pokemon;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: _kafkaName,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: _kafkaName,
            brokers: _KafkaBrokers,
          },
          consumer: {
            groupId: _kafkaName,
          },
        },
      },
    ]),
  ],
  controllers: [PokemonController],
})
export class PokemonModule {}
