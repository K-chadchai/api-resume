import { Module } from '@nestjs/common';
import { CategoryFolderController } from './category-folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryFolderEntity } from 'src/entities/category-folder.entity';
import { CategoryFolderService } from './category-folder.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryFolderEntity])],
  providers: [CategoryFolderService],
  controllers: [CategoryFolderController],
})
export class CategoryFolderModule {}
