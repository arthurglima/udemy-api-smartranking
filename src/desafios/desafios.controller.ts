import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio, Partida } from './interfaces/desafio.interface';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio-dto';
import { AtribuirPartidaDesafioDto } from './dtos/atribuir-partida-desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {

  constructor( private readonly desafiosService: DesafiosService ) {};

  @Post()
  @UsePipes(ValidationPipe)
  async createDesafio( @Body() createDesafioDto: CriarDesafioDto): Promise<Desafio> {
    return await this.desafiosService.createDesafio(createDesafioDto);
  }

  @Get()
  async getAllDesafios(): Promise<Array<Desafio>> {
    return await this.desafiosService.getAllDesafios();
  }

  @Get('/:_id')
  async getDesafioById( @Param() _id: string ): Promise<Desafio> {
    return await this.desafiosService.getDesafioById(_id);
  }

  @Get()
  async getDesafiosFromJogador( @Query('jogadorId') jogadorId: string ): Promise<Array<Desafio>> {
    return await this.desafiosService.getDesafiosFromJogador(jogadorId);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateDesafioById( @Body() updateDesafioDto: AtualizarDesafioDto, @Param() _id: string ): Promise<void> {
    await this.desafiosService.updateDesafioById(_id, updateDesafioDto);
  }

  @Delete('/:_id')
  async deleteDesafioById( @Param() _id: string ): Promise<void> {
    await this.desafiosService.deleteDesafioById(_id);
  }

  @Post('/:desafioId/partida/')
  @UsePipes(ValidationPipe)
  async assignPartidaDesafio(
    @Body() assignPartidaDesafioDto: AtribuirPartidaDesafioDto,
    @Param('desafioId') idDesafio: string
  ): Promise<Partida> {
    return this.desafiosService.assignPartidaDesafio(idDesafio, assignPartidaDesafioDto);
  }

}
