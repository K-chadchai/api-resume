import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { AuthModule } from '../auth/auth.module';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBAUTHOR } from './app.constants';

@Module({
  imports: [
    EasyconfigModule.register({}),
    RouterModule.forRoutes(routes),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      name: DBAUTHOR,
      host: process.env.DB_MSSQL_HOST,
      username: process.env.DB_MSSQL_USERNAME,
      password: process.env.DB_MSSQL_PASSWORD,
      database: DBAUTHOR,
      entities: ['dist/**/*.entity{.ts,.js}'],
      options: { enableArithAbort: true },
      // synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
