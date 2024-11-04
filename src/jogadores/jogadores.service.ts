import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {

  private jogadores: Jogador[] = [];

  private readonly logger = new Logger(JogadoresService.name);

  async createUpdateJogador(createJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = createJogadorDto;

    const jogadorEncontrado = this.jogadores.find(jogador => jogador.email === email);

    if (jogadorEncontrado) {
      this.update(jogadorEncontrado, createJogadorDto);
    } else {
      this.create(createJogadorDto);
    }

  }

  async getAllJogadores(): Promise<Jogador[]> {

    return this.jogadores;
  }

  async getJogadorByEmail(email: string): Promise<Jogador> {
    const jogadorFound = this.jogadores.find(jogador => jogador.email === email);
    if (!jogadorFound) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }
    return jogadorFound;
  }

  async deleteJogador(email: string): Promise<void> {
    const jogadorFound = this.jogadores.find(jogador => jogador.email === email);
    if (!jogadorFound) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }
    this.jogadores = this.jogadores.filter(jogador => jogador.email !== email);
  }

  private create(createJogadorDto: CriarJogadorDto): void {
    const { nome, telefoneCelular, email } = createJogadorDto;
    const jogador: Jogador = {
      _id: uuidv4(),
      telefoneCelular,
      email,
      nome,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'www.google.com.br/foto123.jpg'
    };
    this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }

  private update(jogadorFound: Jogador, criarJogadorDto: CriarJogadorDto): void {
    const { nome } = criarJogadorDto;
    jogadorFound.nome = nome;
  }

}
