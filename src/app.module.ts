import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://arthurglima:RbKqGvtFciaRw1QB@udemy-smart-ranking.tuhuc.mongodb.net/?retryWrites=true&w=majority&appName=udemy-smart-ranking"),
    JogadoresModule,
    CategoriasModule,
    DesafiosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
