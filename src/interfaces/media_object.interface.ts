export interface IMediaObjectEntity {
    id: string,
    folder_id: string,
    object_name: string,
    descripion: string,
    file_type: string,
    file_group: string,
    is_original: number,
    creator: string,
    created_time: Date,
    last_editor: string,
    last_edited_time: Date,
    s3key: string
}