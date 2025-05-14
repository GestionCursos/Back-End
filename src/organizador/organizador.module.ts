import { Module } from '@nestjs/common';
import { OrganizadorService } from './organizador.service';
import { OrganizadorController } from './organizador.controller';

@Module({
  controllers: [OrganizadorController],
  providers: [OrganizadorService],
})
export class OrganizadorModule {}
