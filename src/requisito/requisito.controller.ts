import { Controller, Get } from '@nestjs/common';
import { RequisitoService } from './requisito.service';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('requisito')
export class RequisitoController {
  constructor(private readonly requisitoService: RequisitoService) { }



  @Get()
  @Public()
  findAll() {
    return this.requisitoService.findAll();
  }

}