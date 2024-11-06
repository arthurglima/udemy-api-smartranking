import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { categoriaSchema } from './interfaces/categoria.schema';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { JogadoresModule } from 'src/jogadores/jogadores.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Categoria', schema: categoriaSchema }]), JogadoresModule],
  controllers: [CategoriasController],
  providers: [CategoriasService]
})
export class CategoriasModule {}
