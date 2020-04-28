import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { PokemonEntity } from './pokemon.entity';

@Injectable()
export class PokemonService {
  //
  async create(runner: QueryRunner, value) {
    return await runner.manager.save(PokemonEntity, value);
  }
  async findAll(runner: QueryRunner) {
    return await runner.manager.find(PokemonEntity);
  }
  async findById(runner: QueryRunner, value) {
    return await runner.manager.findByIds(PokemonEntity, [value.id]);
  }
  async update(runner: QueryRunner, value) {
    return await runner.manager.update(PokemonEntity, value.id, value);
  }
  async delete(runner: QueryRunner, value) {
    return await runner.manager.delete(PokemonEntity, value.id);
  }
}
