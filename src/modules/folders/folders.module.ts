import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoldersEntity } from 'src/entities/folders.entity';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FoldersEntity])],
  providers: [FoldersService],
  controllers: [FoldersController],
})
export class FoldersModule {}
