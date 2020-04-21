import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AppService } from 'src/app.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, AppService],
})
export class UsersModule {}
