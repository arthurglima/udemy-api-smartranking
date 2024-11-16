import { BadRequestException, Injectable } from '@nestjs/common';
import { Categoria } from './interfaces/categoria.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService
  ) {};

    async createCategoria(createCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
      const { categoria } = createCategoriaDto;

      const categoriaFound = await this.categoriaModel.findOne({categoria}).exec();
      if (categoriaFound) {
        throw new BadRequestException(`Categoria ${categoria} já cadastrada`);
      }
      const categoriaCreated = new this.categoriaModel(createCategoriaDto);

      return await categoriaCreated.save();
    }

    async updateCategoria(categoria: string, updateCategoriaDto: AtualizarCategoriaDto): Promise<Categoria> {
      const categoriaFound = await this.categoriaModel.findOne({categoria}).exec();
      if (!categoriaFound) {
        throw new BadRequestException(`Categoria com id ${categoria} não encontrada`);
      }
      return await categoriaFound.updateOne({$set: updateCategoriaDto}).exec();
    }

    async getAllCategorias(): Promise<Categoria[]> {
      return await this.categoriaModel.find().populate("jogadores").exec();
    }

    async getCategoriaByName(categoria: string): Promise<Categoria> {
      const categoriaFound = await this.categoriaModel.findOne({categoria}).populate("jogadores").exec();
      if (!categoriaFound) {
        throw new BadRequestException(`Categoria com id ${categoria} não encontrada`);
      }
      return categoriaFound;
    }

    async addCategoriaJogador(params: string[]): Promise<void> {
      const categoria = params['categoria'];
      const idJogador = params['idJogador'];

      const categoriaFound = await this.categoriaModel.findOne({categoria}).exec(); 
      if (!categoriaFound) {
        throw new BadRequestException(`Categoria ${categoria} não encontrada`);
      }

      const jogadorFound = await this.jogadoresService.getJogadorById(idJogador);
      if (!jogadorFound) {
        throw new BadRequestException(`Jogador ${idJogador} não encontrado`);
      }

      const jogadorAlreadyInCategory = categoriaFound.jogadores.some(jogador => jogador['desafioId'] == idJogador);
      if (jogadorAlreadyInCategory) {
        throw new BadRequestException(`Jogador ${idJogador} já cadastrado na categoria ${categoria}`);
      }

      categoriaFound.jogadores.push(idJogador);
      await categoriaFound.save();

    }

    async getCategoriaJogador(idJogador: string): Promise<Categoria> {
      const categoriaFound = await this.categoriaModel.findOne({jogadores: idJogador}).exec();
      if (!categoriaFound) {
        throw new BadRequestException(`Jogador ${idJogador} não encontrado em nenhuma categoria`);
      }

      return categoriaFound;
    }

}
