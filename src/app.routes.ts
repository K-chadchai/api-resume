import { Routes } from 'nest-router';
import { UploaderModule } from './uploader/uploader.module';

export const routes: Routes = [
  {
    path: '/v1',
    children: [UploaderModule],
  },
];
