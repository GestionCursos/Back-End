import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContenidoHomeService } from './contenido_home.service';
import { CreateContenidoHomeDto } from './dto/create-contenido_home.dto';
import { UpdateContenidoHomeDto } from './dto/update-contenido_home.dto';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('contenido-home')
export class ContenidoHomeController {
  constructor(private readonly contenidoHomeService: ContenidoHomeService) {}

  @Post()
  create(@Body() createContenidoHomeDto: CreateContenidoHomeDto) {
    return this.contenidoHomeService.create(createContenidoHomeDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.contenidoHomeService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateContenidoHomeDto: UpdateContenidoHomeDto,
  ) {
    return this.contenidoHomeService.update(id, updateContenidoHomeDto);
  }
}
