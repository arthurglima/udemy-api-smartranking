import { IsNotEmpty } from "class-validator";
import { Resultado } from "src/desafios/interfaces/desafio.interface";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";


export class AtribuirPartidaDesafioDto {
    
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}