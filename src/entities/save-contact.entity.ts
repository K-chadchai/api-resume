import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const tname = 'save_contact';

export interface ISaveContact {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Entity(tname)
export class SaveContactEntity implements ISaveContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  message: string;
}
