import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeccionesService } from './secciones.service';
import { CreateSeccioneDto } from './dto/create-seccione.dto';
import { UpdateSeccioneDto } from './dto/update-seccione.dto';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('secciones')
export class SeccionesController {
  constructor(private readonly seccionesService: SeccionesService) {}

  @Post()
  create(@Body() createSeccioneDto: CreateSeccioneDto) {
    return this.seccionesService.create(createSeccioneDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.seccionesService.findAll();
  }

  @Get('/data')
  @Public()
  findAllSecciones(){
    return this.seccionesService.findAllCreateEvento();
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateSeccioneDto: UpdateSeccioneDto,
  ) {
    return this.seccionesService.update(id, updateSeccioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.seccionesService.remove(id);
  }
}
