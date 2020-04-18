import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { _MongoTables } from 'src/app.constants';
import { TUsersSchema } from './users.schema';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: _MongoTables.users, schema: TUsersSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AppService],
})
export class UsersModule {}
