import { Injectable } from '@nestjs/common';
import { CreateRequisitoInscripcionDto } from './dto/create-requisito_inscripcion.dto';
import { UpdateRequisitoInscripcionDto } from './dto/update-requisito_inscripcion.dto';

@Injectable()
export class RequisitoInscripcionService {
  create(createRequisitoInscripcionDto: CreateRequisitoInscripcionDto) {
    return 'This action adds a new requisitoInscripcion';
  }

  findAll() {
    return `This action returns all requisitoInscripcion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requisitoInscripcion`;
  }

  update(id: number, updateRequisitoInscripcionDto: UpdateRequisitoInscripcionDto) {
    return `This action updates a #${id} requisitoInscripcion`;
  }

  remove(id: number) {
    return `This action removes a #${id} requisitoInscripcion`;
  }
}
