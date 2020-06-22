import { IMediaSideEntity } from "src/interfaces/media_side.interface";
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

const tname = 'media_side';

@Entity(tname)
@Unique(`uc_${tname}_id`, ['id'])

export class MediaSideEntity implements IMediaSideEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: null,
        length: 100
    })
    side_name: string;

    @Column({
        nullable: null,
        length: 255
    })
    description: string;

    @Column({
        nullable: null,
        length: 15
    })
    created_user: string

    @Column({
        nullable: null
    })
    created_time: Date

    @Column({
        nullable: null,
        length: 15
    })
    last_edidor: string

    @Column({
        nullable: null
    })
    last_edited_time: Date

}