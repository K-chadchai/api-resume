import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import multer = require('multer');
import s3Storage = require('multer-sharp-s3');

@Injectable()
export class UploaderService {
  constructor() {
    try {
      aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_DEFAULT_REGION,
      });
    } catch (error) {
      console.error(`Failed to set AWS Config ${error}`);
    }
  }

  //
  async deleteFile(s3key) {
    return await new aws.S3()
      .deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: s3key,
      })
      .promise()
      .then(
        () => {
          Logger.log('deleted:', s3key);
        },
        err => {
          console.error('delete, Error:', err);
        },
      );
  }

  //
  async uploadFile(fileUpload) {
    const { originalname, buffer } = fileUpload;
    const urlKey = `${uuid()}.${originalname}`;
    return await new aws.S3()
      .putObject({
        Body: buffer,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: urlKey,
      })
      .promise()
      .then(
        data => {
          console.log('uploadFile:success', data);
          return urlKey;
        },
        err => {
          console.error('uploadFile:error', err);
          return err;
        },
      );
  }

  // Upload single file only
  async uploadFile2(req, res, query, onSuccess) {
    const deleteFile = this.deleteFile;
    const { path, resize } = query;
    const isResize = resize === 'true';
    const sizes = isResize
      ? [
          { suffix: 'x1200x1200', width: 1200, height: 1200 },
          { suffix: 'x800x800', width: 800, height: 800 },
          { suffix: 'x500x500', width: 500, height: 500 },
          { suffix: 'x300x300', width: 300, height: 300 },
          { suffix: 'x100', width: 100 },
          { suffix: 'x' }, // Original
        ]
      : [{ suffix: 'x' }];
    const fullPath = path ? `${path}/${uuid()}` : uuid();
    //
    const storage = s3Storage({
      Key: (_, _file, cb) => {
        cb(null, fullPath);
      },
      s3: new aws.S3(),
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ACL: 'bucket-owner-full-control',
      multiple: true,
      resize: sizes,
    });
    //
    const upload = multer({ storage }).any();
    await upload(req, res, async function(error) {
      if (error) {
        return res.status(400).json(`Failed to upload image file: ${error}`);
      }
      if (!req.files || req.files.length == 0) {
        return res
          .status(400)
          .json(`Failed to upload image file: Invalid data `);
      }
      //
      const file = req.files[0];
      // console.log('file', file);
      const { originalname, mimetype } = file;
      // Video
      if (file.mimetype.startsWith('video/')) {
        const { size, Key } = file;
        return res
          .status(200)
          .json({ originalname, mimetype, size, s3key: Key });
      }
      // Image
      const files = [];
      sizes.forEach(item => {
        const { width, height, size, Key } = file[item.suffix];
        files.push({
          suffix: item.suffix,
          width,
          height,
          size,
          s3key: Key,
        });
      });
      //
      let result;
      try {
        result = await onSuccess({ originalname, mimetype, files });
      } catch (error) {
        Logger.error(error);
        // delete file
        const runAsync = () =>
          Promise.all(files.map(async item => await deleteFile(item.s3key)));
        runAsync();
        return res.status(500).json(error.response);
      }
      return res.status(200).json(result);
    });
  }

  // Get image body [base64]
  async getImageBody(s3key) {
    if (!s3key) return null;
    try {
      const s3 = new aws.S3();
      const file = await s3
        .getObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3key,
        })
        .promise();
      return file.Body.toString('base64');
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('ASW Not found image');
    }
  }
}
