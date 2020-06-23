import { IMediaObjectEntity } from "src/interfaces/media_object.interface";
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

const tname = 'media_object';

@Entity(tname)
@Unique(`uc_${tname}_foid_objname_fitype`, ['folder_id', 'object_name', 'file_type'])
export class MediaObjectEntity implements IMediaObjectEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 36
    })
    folder_id: string;

    @Column({
        length: 100
    })
    object_name: string;

    @Column({
        nullable: true,
        length: 255
    })
    descripion: string;

    @Column({
        length: 20
    })
    file_type: string;

    @Column({
        nullable: true,
        length: 20
    })
    file_group: string;

    @Column({
        nullable: true
    })
    is_original: number;

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