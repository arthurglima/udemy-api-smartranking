import { Controller, Post } from '@nestjs/common';

@Controller('api/v1/jogadores')
export class JogadoresController {

    @Post()
    async createUpdateJogador() {
        return JSON.stringify({
            "nome": "Teste",
        });
    }

}
