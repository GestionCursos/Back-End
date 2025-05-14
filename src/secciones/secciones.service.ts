import { Injectable } from '@nestjs/common';
import { CreateSeccioneDto } from './dto/create-seccione.dto';
import { UpdateSeccioneDto } from './dto/update-seccione.dto';

@Injectable()
export class SeccionesService {
  create(createSeccioneDto: CreateSeccioneDto) {
    return 'This action adds a new seccione';
  }

  findAll() {
    return `This action returns all secciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seccione`;
  }

  update(id: number, updateSeccioneDto: UpdateSeccioneDto) {
    return `This action updates a #${id} seccione`;
  }

  remove(id: number) {
    return `This action removes a #${id} seccione`;
  }
}
