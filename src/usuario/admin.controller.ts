import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('admin')
export class userAdminController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Get('usuarrios-admin')
  @Public()
  usuariosAdmin() {
    return this.usuarioService.getUsuariosAdmin();
  }
}


  

