import { IMediaFolderEntity } from "src/interfaces/media_folder.interface";
import { PrimaryGeneratedColumn, Column, Entity, Unique, PrimaryColumn } from "typeorm";

const tname = 'media_folder';

@Entity(tname)
@Unique(`uc_${tname}_pid_fname`, ['parent_id', 'folder_name'])
export class MediaFolderEntity implements IMediaFolderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    parent_id: string;

    @Column({
        length: 100
    })
    folder_name: string;

    @Column({
        nullable: null,
        length: 255
    })
    description: string;

    @Column({
        nullable: null,
        length: 15
    })
    reference: string;

    @Column({
        nullable: null,
        length: 20
    })
    folder_type: string;

    @Column({
        nullable: null,
        length: 15
    })
    creator: string;

    @Column({
        nullable: null,
    })
    creator_time: Date;

    @Column({
        nullable: null,
        length: 15
    })
    last_editor: string;

    @Column({
        nullable: null
    })
    last_editor_time: Date;
}