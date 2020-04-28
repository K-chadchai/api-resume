import { Injectable } from '@nestjs/common';
import { PokemonEntity } from './pokemon.entity';
import { QueryRunner } from 'typeorm';

@Injectable()
export class PokemonService {
  async create(runner: QueryRunner, pokemon: PokemonEntity) {
    return await runner.manager.save(PokemonEntity, pokemon);
  }

  async findAll(runner: QueryRunner) {
    return await runner.manager.find(PokemonEntity);
  }

  async update(runner: QueryRunner, pokemon: PokemonEntity) {
    return await runner.manager.update(PokemonEntity, pokemon.id, pokemon);
  }

  async delete(runner: QueryRunner, id: string) {
    return await runner.manager.delete(PokemonEntity, id);
  }
}
