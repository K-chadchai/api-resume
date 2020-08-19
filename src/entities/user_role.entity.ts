import { PrimaryGeneratedColumn, Column, Entity, Unique } from 'typeorm';
import { IUserRoleTokenEntity } from 'src/interfaces/user_role.interface';

const tname = 'user_role';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])
export class UserRoleEntity implements IUserRoleTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
      reference: string;

    @Column({
        nullable: true,
        length: 1000,
      })
    app: string;

    @Column({
        nullable: true,
        length: 1000,
      })
    role: string;
}