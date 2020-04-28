import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { _MongoConn } from './app.constants';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forRoot(_MongoConn, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    UsersModule,
    PokemonModule,
    CoreModule,
  ],
})
export class AppModule {}
