import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { AppService } from 'src/app.service';
import { UploaderModule } from 'src/uploader/uploader.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), UploaderModule],
  providers: [UsersService, AppService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
