import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

  private jogadores: Jogador[] = [];

  constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

  private readonly logger = new Logger(JogadoresService.name);

  async createJogador(createJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = createJogadorDto;

    const jogadorFound = await this.jogadorModel.findOne({email}).exec();

    if (jogadorFound) {
      throw new BadRequestException(`Jogador com e-mail ${email} já cadastrado`);
    }

    const jogador = new this.jogadorModel(createJogadorDto);
    return await jogador.save();
  }

  async updateJogador(_id: string, updateJogadorDto: AtualizarJogadorDto): Promise<Jogador> {
    const jogadorFound = await this.jogadorModel.findOne({_id}).exec();

    if (!jogadorFound) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    // No curso ele usa o método findOneAndUpdate, mas como já temos o objeto, não faz sentido buscar novamente
    return await jogadorFound.updateOne({$set: updateJogadorDto}).exec();
  }

  async getAllJogadores(): Promise<Jogador[]> {

    return await this.jogadorModel.find().exec();
  }

  async getJogadorById(_id: string): Promise<Jogador> {
    const jogadorFound = await this.jogadorModel.findOne({_id: _id}).exec();
    if (!jogadorFound) {
      throw new NotFoundException(`Jogador com e-mail ${_id} não encontrado`);
    }
    return jogadorFound;
  }

  async deleteJogador(_id: string): Promise<boolean> {

    const jogadorFound = await this.jogadorModel.findOne({_id: _id}).exec();

    if (!jogadorFound) {
      throw new NotFoundException(`Jogador com e-mail ${_id} não encontrado`);
    }

    // O método "remove" foi descontinuado, então usamos o "deleteOne"
    const deleteResult = await this.jogadorModel.deleteOne({_id: _id}).exec();
    // Ele estava usando o retorno "any", mas consegui verificar o retorno correto
    return deleteResult.acknowledged && deleteResult.deletedCount > 0;
  }

}
