import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { UploaderService } from 'src/uploader/uploader.service';
import { AppService } from 'src/app.service';
import { MediaService } from 'src/media/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersService, UploaderService, AppService, MediaService],
  controllers: [UsersController],
})
export class UsersModule {}
