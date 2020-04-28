import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { _KafkaBrokers, _KafaModule } from 'src/app.constants';

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
