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

  async findAll() {
    const listaDeContenidos = await this.contenidoHomeRepository.find();
    return listaDeContenidos;
  }



  async update(id: number, updateContenidoHomeDto: UpdateContenidoHomeDto) {
    const contendidoModificado = await this.contenidoHomeRepository.update(
      id,
      updateContenidoHomeDto,
    );
    return contendidoModificado;
  }

  
}
