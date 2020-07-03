export interface IMediaPermissionEntity {
    id: string,
    role_id: string,
    action_id: string,
    is_read: number,
    is_add: number,
    is_edit: number,
    is_delete: number,
    creator: string,
    created_time: Date,
    last_editor: string,
    last_edited_time: Date,
}