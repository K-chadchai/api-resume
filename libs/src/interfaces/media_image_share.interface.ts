export interface IMediaImageShareEntity {
  id: string;
  object_id: string;
  file_type: string;
  resolution: string;
  url: string;
  creator: string;
  created_time: Date;
  last_editor: string;
  last_edited_time: Date;
  s3key: string;
  share_type: string;
}
