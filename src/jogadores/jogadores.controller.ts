import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresValidationParametersPipe } from './pipes/jogadores-validation-parameters.pipe';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(private readonly jogadoresService: JogadoresService) {};

  @Post()
  @UsePipes(ValidationPipe)
  async createJogador( @Body() criarJogadorDto: CriarJogadorDto ): Promise<Jogador> {
    return await this.jogadoresService.createJogador(criarJogadorDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id', JogadoresValidationParametersPipe) _id: string
  ): Promise<Jogador> {
    return await this.jogadoresService.updateJogador(_id, atualizarJogadorDto);
  }

  @Get()
  async getAllJogadores(): Promise<Jogador[]> {
    return  await this.jogadoresService.getAllJogadores();
  }

  @Get('/:_id')
  async getJogadorById( @Param('_id', JogadoresValidationParametersPipe) _id: string ): Promise<Jogador> {
    return  await this.jogadoresService.getJogadorById(_id);
  }

  @Delete('/:_id')
  async deleteJogador( @Param('_id', JogadoresValidationParametersPipe) _id: string ): Promise<void> {
    await this.jogadoresService.deleteJogador(_id);
  }

}
