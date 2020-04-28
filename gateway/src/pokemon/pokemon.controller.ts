import {
  Controller,
  Inject,
  Post,
  Get,
  Put,
  Delete,
  InternalServerErrorException,
  Req,
  Body,
} from '@nestjs/common';
import { _KafaModule } from 'src/app.constants';
import { ClientKafka } from '@nestjs/microservices';
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
  send(_action: String, value = {}) {
    return this.svcMediaPokemon.send(_kafkaName, { _action, ...value }).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }
  //
  @Post()
  create(@Body() createPokemon: CreatePokemonDto) {
    return this.send('create', createPokemon);
  }

  @Get()
  findAll() {
    return this.send('findAll');
  }

  @Get('/:id')
  findById(@Req() { params }) {
    const { id } = params;
    return this.send('findById', { id });
  }

  @Put()
  update(@Body() updatePokemon: UpdatePokemonDto) {
    return this.send('update', updatePokemon);
  }

  @Delete('/:id')
  delete(@Req() { params }) {
    const { id } = params;
    return this.send('delete', { id });
  }
}
