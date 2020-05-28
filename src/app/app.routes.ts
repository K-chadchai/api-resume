import { Routes } from 'nest-router';
import { AuthModule } from 'src/auth/auth.module';

export const routes: Routes = [
  {
    path: '/v1',
    module: AuthModule,
  },
];
