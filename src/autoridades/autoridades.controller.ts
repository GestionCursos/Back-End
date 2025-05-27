import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutoridadesService } from './autoridades.service';
import { CreateAutoridadeDto } from './dto/create-autoridade.dto';
import { UpdateAutoridadeDto } from './dto/update-autoridade.dto';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('autoridades')
export class AutoridadesController {
  constructor(private readonly autoridadesService: AutoridadesService) {}

  @Post()
  create(@Body() createAutoridadeDto: CreateAutoridadeDto) {
    return this.autoridadesService.create(createAutoridadeDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.autoridadesService.findAll();
  }

 

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAutoridadeDto: UpdateAutoridadeDto) {
    return this.autoridadesService.update(id, updateAutoridadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.autoridadesService.remove(id);
  }
}
