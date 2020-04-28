import { IsNotEmpty } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly type: string;
  readonly age: number;
}

export class UpdatePokemonDto {
  @IsNotEmpty()
  readonly id: string;
  readonly name: string;
}
