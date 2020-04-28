import {
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { _KafaModule } from 'src/app.constants';
import { catchError } from 'rxjs/operators';
import { CreatePokemonDto, UpdatePokemonDto } from './pokemon.dto';

const _kafkaName = _KafaModule.pokemon;

@Controller('pokemon')
export class PokemonController {
  constructor(@Inject(_kafkaName) private readonly svcMediaPokemon: ClientKafka) {}
  //
  async onModuleInit() {
    this.svcMediaPokemon.subscribeToResponseOf(_kafkaName);
    await this.svcMediaPokemon.connect();
  }
  //
  send(_action, value = {}) {
    return this.svcMediaPokemon.send(_kafkaName, { _action, ...value }).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.send('create', createPokemonDto);
  }

  @Get()
  findAll() {
    return this.send('findAll');
  }

  @Put()
  update(@Body() updatePokemonDto: UpdatePokemonDto) {
    return this.send('update', updatePokemonDto);
  }

  @Delete('/:delete')
  delete(@Req() { params: { id } }) {
    return this.send('delete', id);
  }
}
