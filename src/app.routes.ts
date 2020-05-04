import { Routes } from 'nest-router';
import { UploaderModule } from './uploader/uploader.module';
import { MediaModule } from './media/media.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';

export const routes: Routes = [
  {
    path: '/v1',
    children: [UploaderModule, MediaModule, CategoryModule, UsersModule],
  },
];
