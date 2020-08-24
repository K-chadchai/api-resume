import { Module } from '@nestjs/common';
import { MediaColorxService } from './media-colorx.service';
import { MediaColorxController } from './media-colorx.controller';
import { MediaColorxEntity } from 'src/entities/media_colorx.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaColorxEntity])],
  providers: [MediaColorxService, AppService],
  controllers: [MediaColorxController],
})
export class MediaColorxModule {}
