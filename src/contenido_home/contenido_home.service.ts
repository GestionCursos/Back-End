import { Injectable } from '@nestjs/common';
import { CreateContenidoHomeDto } from './dto/create-contenido_home.dto';
import { UpdateContenidoHomeDto } from './dto/update-contenido_home.dto';

@Injectable()
export class ContenidoHomeService {
  create(createContenidoHomeDto: CreateContenidoHomeDto) {
    return 'This action adds a new contenidoHome';
  }

  findAll() {
    return `This action returns all contenidoHome`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contenidoHome`;
  }

  update(id: number, updateContenidoHomeDto: UpdateContenidoHomeDto) {
    return `This action updates a #${id} contenidoHome`;
  }

  remove(id: number) {
    return `This action removes a #${id} contenidoHome`;
  }
}
