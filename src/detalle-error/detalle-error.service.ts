import { Injectable } from '@nestjs/common';
import { CreateDetalleErrorDto } from './dto/create-detalle-error.dto';
import { UpdateDetalleErrorDto } from './dto/update-detalle-error.dto';

@Injectable()
export class DetalleErrorService {
  create(createDetalleErrorDto: CreateDetalleErrorDto) {
    return 'This action adds a new detalleError';
  }

  findAll() {
    return `This action returns all detalleError`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalleError`;
  }

  update(id: number, updateDetalleErrorDto: UpdateDetalleErrorDto) {
    return `This action updates a #${id} detalleError`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleError`;
  }
}
