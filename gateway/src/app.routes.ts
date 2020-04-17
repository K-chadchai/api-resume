import { Routes } from 'nest-router';
import { AppModule } from 'src/app.module';
import { PictureModule } from 'src/picture/picture.module';
import { UsersModule } from './users/users.module';

export const routes: Routes = [
  {
    path: '/v1',
    children: [PictureModule, UsersModule],
  },
];
