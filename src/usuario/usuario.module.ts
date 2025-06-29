import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { FacultadModule } from 'src/facultad/facultad.module';
import { userAdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]),FacultadModule],
  controllers: [UsuarioController,userAdminController],
  providers: [UsuarioService],
  exports:[UsuarioService]
})
export class UsuarioModule {}