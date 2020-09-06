import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

@Module({
  imports: [
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
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
