import { Module } from '@nestjs/common';
import { OrganizadorService } from './organizador.service';
import { OrganizadorController } from './organizador.controller';
import { Organizador } from './entities/organizador.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Organizador])],
  controllers: [OrganizadorController],
  providers: [OrganizadorService],
})
export class OrganizadorModule {}
