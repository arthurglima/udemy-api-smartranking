import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { DesafioStatus } from "../interfaces/desafio-status.enum";

enum DesafioStatusUpdate {
  ACEITO = 'ACEITO',
  NEGADO = 'NEGADO',
  CANCELADO = 'CANCELADO',
}

export class AtualizarDesafioDto {
  @IsOptional()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsOptional()
  @IsEnum(DesafioStatusUpdate)
  status: DesafioStatus;

}


