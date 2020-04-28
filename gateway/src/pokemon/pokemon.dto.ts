import { IsNotEmpty } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  readonly code: string;
  readonly type: string;
  readonly name: string;
}
