import { Routes } from 'nest-router';
import { AppModule } from 'src/app.module';
import { PictureModule } from 'src/picture/picture.module';

export const routes: Routes = [
  {
    path: '/media',
    module: AppModule,
    children: [
      {
        path: '/picture',
        module: PictureModule,
      },
    ],
  },
];
