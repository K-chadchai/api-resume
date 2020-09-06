import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { IImagePostitionEntity } from '@libs';

// ตำแหน่งที่ถ่ายภาพ
const tname = 'image_position';

@Entity(tname)
@Unique(`uc_${tname}_position_name`, ['position_name'])
export class ImagePostitionEntity implements IImagePostitionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: 'ชื่อตำแหน่ง' })
  position_name: string;

  @Column({ nullable: true, comment: 'คำอธิบาย' })
  description: string;
}
