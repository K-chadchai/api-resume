export interface IMediasEntity {
  id: string;
  path: string;
  originalname: string;
  mimetype: string;
  description: string;
  video_size: number;
  video_s3key: string;
  created_user: string;
  created_time: Date;
  media_status: string;
  deleted_user: string;
  deleted_time: Date;
}
