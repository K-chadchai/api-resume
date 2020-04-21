import { Module } from '@nestjs/common';
import { PictureModule } from './picture/picture.module';
import { MongooseModule } from '@nestjs/mongoose';
import { _MongoConn } from './app.constants';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    MongooseModule.forRoot(_MongoConn, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    CoreModule,
    PictureModule,
    UsersModule,
  ],
})
export class AppModule {}
