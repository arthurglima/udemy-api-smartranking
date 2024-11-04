import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

  private jogadores: Jogador[] = [];

  constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

  private readonly logger = new Logger(JogadoresService.name);

  async createUpdateJogador(createJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = createJogadorDto;

    const jogadorFound = await this.jogadorModel.findOne({email}).exec();

    if (jogadorFound) {
      await this.update(jogadorFound, createJogadorDto);
    } else {
      await this.create(createJogadorDto);
    }

  }

  async getAllJogadores(): Promise<Jogador[]> {

    return await this.jogadorModel.find().exec();
  }

  async getJogadorByEmail(email: string): Promise<Jogador> {
    const jogadorFound = await this.jogadorModel.findOne({email}).exec();
    if (!jogadorFound) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }
    return jogadorFound;
  }

  async deleteJogador(email: string): Promise<boolean> {
    // O método "remove" foi descontinuado, então usamos o "deleteOne"
    const deleteResult = await this.jogadorModel.deleteOne({email}).exec();
    // Ele estava usando o retorno "any", mas consegui verificar o retorno correto
    return deleteResult.acknowledged && deleteResult.deletedCount > 0;
  }

  private async create(createJogadorDto: CriarJogadorDto): Promise<Jogador> {

    const jogador = new this.jogadorModel(createJogadorDto);
    return await jogador.save();
  }

  private async update(jogadorFound: Jogador, criarJogadorDto: CriarJogadorDto): Promise<Jogador> {

    // No curso ele usa o método findOneAndUpdate, mas como já temos o objeto, não faz sentido buscar novamente
    return await jogadorFound.updateOne(criarJogadorDto).exec();
  }

}
