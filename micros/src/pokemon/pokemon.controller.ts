import { Controller, UseFilters } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { AppService, AppExceptions } from 'src/app.service';
import { Payload, MessagePattern, RpcException } from '@nestjs/microservices';
import { _KafaModule } from 'src/app.constants';

@Controller()
@UseFilters(new AppExceptions())
export class PokemonController {
  constructor(
    private readonly appService: AppService,
    private readonly pokemonService: PokemonService,
  ) {}
  //
  @MessagePattern(_KafaModule.pokemon)
  async action(@Payload() payload) {
    const { _action, ...value } = payload.value;
    console.log('_action', _action);
    console.log('value', value);
    try {
      return this.appService.postgresRunner((runner) => {
        switch (_action) {
          case 'create':
            console.log('create', value);
            break;

          default:
            break;
        }
      });
    } catch (error) {
      throw new RpcException(error.errmsg || error.message);
    }
  }
}
