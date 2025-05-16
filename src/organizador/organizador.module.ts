import { Module } from '@nestjs/common';
import { OrganizadorService } from './organizador.service';
import { OrganizadorController } from './organizador.controller';
import { Organizador } from './entities/organizador.entity';

@Module({
  imports:[Organizador],
  controllers: [OrganizadorController],
  providers: [OrganizadorService],
})
export class OrganizadorModule {}
