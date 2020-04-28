import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonModule])],
  providers: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
