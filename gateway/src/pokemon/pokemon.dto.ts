import { IsNotEmpty } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  readonly code: string;
  readonly type: string;
  readonly name: string;
}

export class UpdatePokemonDto {
  @IsNotEmpty()
  readonly id: string;
  readonly name: string;
}
