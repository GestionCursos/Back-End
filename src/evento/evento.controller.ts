import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) { }

  @Post()
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventoService.create(createEventoDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.eventoService.findAll();
  }
  @Get('populares')
  @Public()
  findPopulares() {
    return this.eventoService.getEventosPopulares();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventoService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.eventoService.remove(id);
  }
}
