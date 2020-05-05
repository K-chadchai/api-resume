import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { UploaderService } from 'src/uploader/uploader.service';
import { AppService } from 'src/app.service';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), MediaModule],
  providers: [UsersService, UploaderService, AppService],
  controllers: [UsersController],
})
export class UsersModule {}
