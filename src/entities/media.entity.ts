import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MediaFiles } from './media_files.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  key: string;

  files: MediaFiles[];
}
