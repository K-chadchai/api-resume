import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RouterModule.forRoutes(routes), UsersModule],
})
export class AppModule {}
