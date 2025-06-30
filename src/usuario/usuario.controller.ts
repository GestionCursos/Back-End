import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto, @Request() rec) {
    return this.usuarioService.create(createUsuarioDto, rec.userUid);
  }
  @Get('dashboard')
  getDashboardData(@Request() req) {
    const uid = req.userUid;
    return this.usuarioService.getDashboardData(uid);
  }
  
  @Get('firebase/:uid')
  findOneByFirebaseUid(@Param('uid') uid: string) {
    return this.usuarioService.findOne(uid);
  }
  
  @Get('evento/:id')
  findAll(@Param('id') id: number) {
    return this.usuarioService.findUsuariosPorEvento(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }

  @Get('rol')
  findByRol(@Request() req) {
    console.log(req.userUid)
    return this.usuarioService.findRol(req.userUid);
  }
}
