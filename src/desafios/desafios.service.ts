import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Desafio, Partida } from './interfaces/desafio.interface';
import { Model } from 'mongoose';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CategoriasService } from 'src/categorias/categorias.service';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio-dto';
import { AtribuirPartidaDesafioDto } from './dtos/atribuir-partida-desafio.dto';

@Injectable()
export class DesafiosService {

  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  async createDesafio(createDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { dataHoraDesafio, solicitante, jogadores } = createDesafioDto;

    this.logger.log(`solicitante: ${JSON.stringify(solicitante)}`);

    const desafioFound = await this.desafioModel.findOne({dataHoraDesafio}).exec();
    if (desafioFound) {
      throw new BadRequestException(`Desafio para a data ${dataHoraDesafio} já cadastrado`);
    }
    let jogador1Found: Jogador, jogador2Found: Jogador;
    try{
      jogador1Found = await this.jogadoresService.getJogadorById(jogadores[0].id.toString());
      jogador2Found = await this.jogadoresService.getJogadorById(jogadores[1].id.toString());  
    } catch (error) {
      const jogadorNotFound = !jogador1Found ? jogadores[0].id : jogadores[1].id;
      throw new BadRequestException(`O id ${jogadorNotFound} não pertence a nenhum jogador cadastrado!`);
    }

    // Verifica se o solicitante é um dos jogadores
    const solicitanteFound = jogadores.filter(jogador => jogador.id === solicitante);
    if (!solicitanteFound){
      throw new BadRequestException(`O id solicitante não é de um dos participantes!`);
    }

    const categoriaSolicitante = await this.categoriasService.getCategoriaJogador(solicitante.toString());

    const desafio = new this.desafioModel({
      ...createDesafioDto,
      categoria: categoriaSolicitante.categoria,
      dataHoraSolicitacao: new Date(),
      status: DesafioStatus.PENDENTE
    });
    return await desafio.save();
  }

  async getAllDesafios(): Promise<Array<Desafio>> {
    return await this.desafioModel.find().populate('solicitante').populate('jogadores').populate('partida').exec();
  }

  async getDesafioById(_id: string): Promise<Desafio> {
    const desafioFound = await this.desafioModel.findOne({desafioId: _id}).exec();
    if (!desafioFound) {
      throw new BadRequestException(`Desafio com id ${_id} não encontrado`);
    }
    return desafioFound;
  }

  async getDesafiosFromJogador(_id: string): Promise<Array<Desafio>> {
    const jogadorFound = await this.jogadoresService.getJogadorById(_id);
    if (!jogadorFound) {
      throw new BadRequestException(`Jogador com id ${_id} não encontrado`);
    }
    return await this.desafioModel.find({ jogadores: _id }).populate('solicitante').populate('jogadores').populate('partida').exec();
  }

  async updateDesafioById(_id: string, updateDesafioDto: AtualizarDesafioDto): Promise<void> {
    const desafioFound = await this.getDesafioById(_id);

    return await desafioFound.updateOne({$set: updateDesafioDto}).exec();
  }

  async deleteDesafioById(_id: string): Promise<void> {
    const desafioFound = await this.getDesafioById(_id);

    if (!desafioFound) {
      throw new BadRequestException(`Desafio com id ${_id} não encontrado`);
    }
    await desafioFound.updateOne({$set: {status: DesafioStatus.CANCELADO}}).exec();
  }

  async assignPartidaDesafio(idDesafio: string, assignPartidaDesafioDto: AtribuirPartidaDesafioDto): Promise<Partida> {

    const desafioFound = await this.desafioModel.findById(idDesafio).exec();
    if (!desafioFound) {
      throw new BadRequestException(`Desafio com id ${idDesafio} não encontrado`);
    }

    const vencedorFound = desafioFound.jogadores.filter(jogador => jogador == assignPartidaDesafioDto.def);
    if (!vencedorFound) {
      throw new BadRequestException(`O jogador vencedor não faz parte do desafio`);
    }

    const partida = await this.partidaModel.create({
      ...assignPartidaDesafioDto,
      categoria: desafioFound.categoria,
      jogadores: desafioFound.jogadores
    });
    const partidaCreated = await partida.save();

    try{
      await desafioFound.updateOne({$set: {
        partida: {_id: partidaCreated._id}, 
        status: DesafioStatus.REALIZADO
      }}).exec();
    } catch (error) {
      await partidaCreated.deleteOne().exec();
      throw new InternalServerErrorException(error.message);
    }
    
    return partidaCreated;
  }

}
