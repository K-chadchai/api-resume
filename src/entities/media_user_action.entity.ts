import { IMediaUserActionEntity } from "src/interfaces/media_user_action.interface"
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";


const tname = 'media_user_action';

@Entity(tname)
@Unique(`uc_${tname}_code`, ['code'])
export class MediaUserActionEntity implements IMediaUserActionEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 10
    })
    code: string;

    @Column({
        nullable: true,
        length: 255
    })
    description: string;

    @Column({
        nullable: true,
        length: 15
    })
    creator: string;

    @Column({
        nullable: true
    })
    created_time: Date;

    @Column({
        nullable: true,
        length: 15
    })
    last_editor: string;

    @Column({
        nullable: true
    })
    last_edited_time: Date;
}