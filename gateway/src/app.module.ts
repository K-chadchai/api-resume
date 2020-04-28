import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { UsersModule } from './users/users.module';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [RouterModule.forRoutes(routes), UsersModule, PokemonModule],
})
export class AppModule {}
