import { Routes } from 'nest-router';
import { UsersModule } from './users/users.module';
import { PokemonModule } from './pokemon/pokemon.module';

export const routes: Routes = [
  {
    path: '/v1',
    children: [UsersModule, PokemonModule],
  },
];
