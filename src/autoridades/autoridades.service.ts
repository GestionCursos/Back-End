import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAutoridadeDto } from './dto/create-autoridade.dto';
import { UpdateAutoridadeDto } from './dto/update-autoridade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Autoridade } from './entities/autoridade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AutoridadesService {
  constructor(
    @InjectRepository(Autoridade)
    private autoridadesRepository: Repository<Autoridade>,
  ) {}
  async create(createAutoridadeDto: CreateAutoridadeDto) {
    const guardarAutoridad =
      await this.autoridadesRepository.save(createAutoridadeDto);
      if(!guardarAutoridad) throw new  NotFoundException("La autoridad no se pudo guardar");  
      return guardarAutoridad;
  }

  async findAll() {
    const listaAoutridades= await this.autoridadesRepository.find();
    return listaAoutridades;
  }

 

 async update(id: number, updateAutoridadeDto: UpdateAutoridadeDto) {
    const contenidoModificado= await this.autoridadesRepository.update(id,updateAutoridadeDto);
    if(!contenidoModificado) throw new  NotFoundException("La Autoridad no se pudo actualizar");
    return contenidoModificado;
  }

  async remove(id: number) {
    await this.autoridadesRepository.delete(id);
    return true ;
  }
}
