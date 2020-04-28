import { Routes } from 'nest-router';
import { UsersModule } from './users/users.module';

export const routes: Routes = [
  {
    path: '/v1',
    children: [UsersModule],
  },
];
