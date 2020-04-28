import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { _MongoConn } from './app.constants';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonModule } from './pokemon/pokemon.module';

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
    CoreModule,
    PokemonModule,
  ],
})
export class AppModule {}
