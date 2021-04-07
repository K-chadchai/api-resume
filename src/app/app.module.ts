import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { SaveContactModule } from 'src/modules/save-contact/save-contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    EasyconfigModule.register({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    RouterModule.forRoutes(routes),
    SaveContactModule,
  ],
  providers: [],
})
export class AppModule {}
