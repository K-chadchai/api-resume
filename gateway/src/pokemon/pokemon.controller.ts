import { Controller, Inject, Post, Get, Put, Delete } from '@nestjs/common';
import { _KafaModule } from 'src/app.constants';
import { ClientKafka } from '@nestjs/microservices';

@Controller('pokemon')
export class PokemonController {
  constructor(@Inject(_KafaModule.pokemon) private readonly svcMediaPokemon: ClientKafka) {}
  //
  @Post()
  create() {
    console.log('Hello Pokemon');
  }

  @Get()
  findAll() {
    console.log('findAll');
  }

  @Put()
  update() {
    console.log('Update');
  }

  @Delete()
  delete() {
    console.log('Delete');
  }
}
