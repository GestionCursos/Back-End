import { Injectable } from '@nestjs/common';
import { CreateContenidoHomeDto } from './dto/create-contenido_home.dto';
import { UpdateContenidoHomeDto } from './dto/update-contenido_home.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContenidoHome } from './entities/contenido_home.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContenidoHomeService {
  constructor(
    @InjectRepository(ContenidoHome)
    private contenidoHomeRepository: Repository<ContenidoHome>,
  ) {}
  async create(createContenidoHomeDto: CreateContenidoHomeDto) {
    const contenidoGuardado = await this.contenidoHomeRepository.save(
      createContenidoHomeDto,
    );
    return contenidoGuardado;
  }

  findAll() {
    return `This action returns all contenidoHome`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contenidoHome`;
  }

  async update(id: number, updateContenidoHomeDto: UpdateContenidoHomeDto) {
    const contendidoModificado= await this.contenidoHomeRepository.update(id,updateContenidoHomeDto);
    return contendidoModificado;
  }

  remove(id: number) {
    return `This action removes a #${id} contenidoHome`;
  }
}
