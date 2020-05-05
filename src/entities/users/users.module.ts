import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users.entity';
import { AppService } from 'src/app.service';
import { UploaderService } from 'src/services/uploader.service';
import { MediaModule } from 'src/media/media.module';
import { UsersController } from 'src/users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), MediaModule],
  providers: [UsersService, AppService, UploaderService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
