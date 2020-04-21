import { Module } from '@nestjs/common';
import { PictureModule } from './picture/picture.module';
import { _MongoConn } from './app.constants';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PictureModule, UsersModule, PokemonModule],
})
export class AppModule {}
