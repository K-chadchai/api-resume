export interface IMediaFolderEntity {
    id: string,
    parent_id: string,
    folder_name: string,
    description: string,
    reference: string,
    folder_type: string,
    creator: string,
    creator_time: Date,
    last_editor: string,
    last_editor_time: Date,
}