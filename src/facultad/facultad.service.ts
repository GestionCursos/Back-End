import { Injectable } from '@nestjs/common';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@Injectable()
export class FacultadService {
  findOne(id: number) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  create(createFacultadDto: CreateFacultadDto) {
    throw new Error('Method not implemented.');
  }

}
