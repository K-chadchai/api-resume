import { IMediaSideEntity } from "src/interfaces/media_side.interface";
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

const tname = 'media_side';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])

export class MediaSideEntity implements IMediaSideEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 100
    })
    side_name: string;

    @Column({
        length: 255
    })
    description: string;

    @Column({
        length: 15
    })
    created_user: string

    @Column()
    created_time: Date

    @Column({
        length: 15
    })
    last_edidor: string

    @Column()
    last_edited_time: Date

}