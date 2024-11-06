import { CategoriasService } from './categorias.service';
import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {

  constructor(private readonly categoriasService: CategoriasService) {};

  @Post()
  @UsePipes(ValidationPipe)
  async createCategoria( @Body() criarCategoriaDto: CriarCategoriaDto ): Promise<Categoria> {
    
    return await this.categoriasService.createCategoria(criarCategoriaDto);
  }

  @Get()
  async getCategorias(): Promise<Categoria[]> {
    return await this.categoriasService.getAllCategorias();
  }

  @Get('/:categoria')
  async getCategoriaByName( @Param('categoria') categoria: string ): Promise<Categoria> {
    return await this.categoriasService.getCategoriaByName(categoria);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async updateCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('categoria') categoria: string
  ): Promise<Categoria> {
    return await this.categoriasService.updateCategoria(categoria, atualizarCategoriaDto);
  }

  @Post('/:categoria/jogadores/:idJogador')
  async addCategoriaJogador( @Param() params: string[]): Promise<void> {
    
    return await this.categoriasService.addCategoriaJogador(params);
  }

}
