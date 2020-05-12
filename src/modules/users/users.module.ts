import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { AppService } from 'src/app/app.service';
import { UploaderService } from 'src/services/uploader.service';
import { MediasModule } from 'src/modules/medias/medias.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), MediasModule],
  providers: [UsersService, AppService, UploaderService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
