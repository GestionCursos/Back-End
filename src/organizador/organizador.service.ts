import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizadorDto } from './dto/create-organizador.dto';
import { UpdateOrganizadorDto } from './dto/update-organizador.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizador } from './entities/organizador.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizadorService {
  constructor(@InjectRepository(Organizador)
  private readonly organizadorRepository: Repository<Organizador>) { }
  async create(createOrganizadorDto: CreateOrganizadorDto) {
    const organizadorCreado = await this.organizadorRepository.save(createOrganizadorDto)
    if (!organizadorCreado) throw new NotFoundException("No se pudo crear el organizador")
    return organizadorCreado;
  }

  async findAll() {
    const listaOrganizadores = await this.organizadorRepository.find();
    return listaOrganizadores;
  }

  async findByID(id: number) {
    const organisadorEncontrado = await this.organizadorRepository.findOneBy({ id: id });
    if (!organisadorEncontrado) throw new NotFoundException("No se encontro al organisador buscado")
    return organisadorEncontrado;
  }
  async update(id: number, updateOrganizadorDto: UpdateOrganizadorDto) {
    const organizadorEncontrado = await this.findByID(id);
    organizadorEncontrado.nombre=updateOrganizadorDto.nombre;
    return this.organizadorRepository.update(id,organizadorEncontrado);    
  }

  async findOne(id: number) {
    const organizadorEncontrado = await this.findByID(id);
    if (!organizadorEncontrado) throw new NotFoundException("No se encontro al organizador buscado")
    return organizadorEncontrado;
  }

}
