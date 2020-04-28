import {
  Controller,
  Inject,
  Post,
  Get,
  Put,
  Delete,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { _KafaModule } from 'src/app.constants';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';

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
  create() {
    return this.send('create', { name: 'nikom' });
  }

  @Get()
  findAll() {
    console.log('findAll');
  }

  @Get('/:id')
  findById(@Req() { params }) {
    const { id } = params;
    console.log('id', id);
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
