import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizadorService } from './organizador.service';
import { CreateOrganizadorDto } from './dto/create-organizador.dto';
import { UpdateOrganizadorDto } from './dto/update-organizador.dto';

@Controller('organizador')
export class OrganizadorController {
  constructor(private readonly organizadorService: OrganizadorService) {}

  @Post()
  create(@Body() createOrganizadorDto: CreateOrganizadorDto) {
    return this.organizadorService.create(createOrganizadorDto);
  }

  @Get()
  findAll() {
    return this.organizadorService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizadorDto: UpdateOrganizadorDto) {
    return this.organizadorService.update(+id, updateOrganizadorDto);
  }

}
