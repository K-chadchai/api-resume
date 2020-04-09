import { Routes } from 'nest-router';
import { AuthModule } from 'src/auth/auth.module';

export const routes: Routes = [
  {
    path: '/authen',
    module: AuthModule,
  },
];
