import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

@Controller('api/v1/jogadores')
export class JogadoresController {

  constructor(private readonly jogadoresService: JogadoresService) {};

  @Post()
  async createUpdateJogador( @Body() criarJogadorDto: CriarJogadorDto ) {
    
    await this.jogadoresService.createUpdateJogador(criarJogadorDto);
  }

  @Get()
  async getJogadores( @Query('email') email: string ): Promise<Jogador | Jogador[]> {
    if (email) {
      return  await this.jogadoresService.getJogadorByEmail(email);
    }
    return  await this.jogadoresService.getAllJogadores();
  }

  @Delete()
  async deleteJogador( @Query('email') email: string ): Promise<void> {
    await this.jogadoresService.deleteJogador(email);
  }

}
