import { Controller, UseFilters, Inject } from '@nestjs/common';
import { _KafaModule } from 'src/app.constants';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AppExceptions, AppService } from 'src/app.service';
import { PokemonService } from './pokemon.service';

@Controller()
@UseFilters(new AppExceptions())
export class PokemonController {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly appService: AppService,
  ) {}

  @MessagePattern(_KafaModule.pokemon)
  async action(@Payload() payload) {
    try {
      const { _action, ...value } = payload.value;
      console.log('_action', _action);
      console.log('value', value);
      return await this.appService.postgresRunner(async (runner) => {
        switch (_action) {
          case 'create':
            return await this.pokemonService.create(runner, value);
          case 'findAll':
            return await this.pokemonService.findAll(runner);
          case 'update':
            return await this.pokemonService.update(runner, value);
          case 'delete':
            return await this.pokemonService.delete(runner, value);
          default:
            throw new RpcException(`Not in case, ${_action}`);
        }
      });
    } catch (error) {
      throw new RpcException(error.errmsg || error.message);
    }
  }
}
