import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('pokemon')
export class PokemonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 5 })
  code: string;

  @Column('varchar', { length: 5, nullable: false })
  type: string;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('numeric', { default: 0 })
  age: number;

  @Column('varchar', { length: 1, default: '0' })
  dead_status: string;

  @Column('date', { nullable: true })
  dead_date: Date;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  create_date: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_time: Date;
}
