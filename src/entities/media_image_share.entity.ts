import { IMediaImageShareEntity } from "src/interfaces/media_image_share.interface";
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

const tname = 'media_image_share';

@Entity(tname)
@Unique(`uc_${tname}_oid_f_r_u`, ['object_id', 'file_type', 'resolution', 'url'])
export class MediaImageShareEntity implements IMediaImageShareEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 36
    })
    object_id: string;

    @Column({
        length: 20
    })
    file_type: string;

    @Column({
        length: 20
    })
    resolution: string;

    @Column({
        length: 300
    })
    url: string;

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

    @Column({
        nullable: true,
        length: 255
    })
    s3key: string;
}