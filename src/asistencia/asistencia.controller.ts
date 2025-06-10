import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';  
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('asistencia')
export class AsistenciaController {
 
  constructor(private readonly asistenciaService: AsistenciaService) { }

  @Post()
  @Public()
  create(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return this.asistenciaService.create(createAsistenciaDto);
  }
}
