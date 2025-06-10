import { Injectable } from '@nestjs/common';
import { CreateRequisitoEventoDto } from './dto/create-requisito_evento.dto';
import { UpdateRequisitoEventoDto } from './dto/update-requisito_evento.dto';

@Injectable()
export class RequisitoEventoService {
  create(createRequisitoEventoDto: CreateRequisitoEventoDto) {
    return 'This action adds a new requisitoEvento';
  }

  findAll() {
    return `This action returns all requisitoEvento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requisitoEvento`;
  }

  update(id: number, updateRequisitoEventoDto: UpdateRequisitoEventoDto) {
    return `This action updates a #${id} requisitoEvento`;
  }

  remove(id: number) {
    return `This action removes a #${id} requisitoEvento`;
  }
}
