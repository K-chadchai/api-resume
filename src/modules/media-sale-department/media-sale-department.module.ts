import { Module } from '@nestjs/common';
import { MediaSaleDepartmentService } from './media-sale-department.service';
import { MediaSaleDepartmentController } from './media-sale-department.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaSaleDepartmentEntity } from 'src/entities/media_sale_department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaSaleDepartmentEntity])],
  providers: [MediaSaleDepartmentService, AppService],
  controllers: [MediaSaleDepartmentController]
})
export class MediaSaleDepartmentModule { }
