import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Facultad } from './entities/facultad.entity';

@Injectable()
export class FacultadService {
  constructor(
     @InjectRepository(Facultad)
     private readonly facultadRepository: Repository<Facultad>
  ) { }
  async findOne(id: number) {
    const facultadEncontrada=await this.facultadRepository.findOne({ where: { id } });
    if (!facultadEncontrada) throw new NotFoundException("No se encontro la facultad buscada")
    return facultadEncontrada;
  }
  async findAll() {
    const facultades = await this.facultadRepository.find();
    if (!facultades) throw new NotFoundException("No se encontraron facultades");
    return facultades;
  }
  async create(createFacultadDto: CreateFacultadDto) {
    const nuevaFacultad = this.facultadRepository.create(createFacultadDto);
    await this.facultadRepository.save(nuevaFacultad);
    return nuevaFacultad;
  }
  async findByIds(ids: number[]) {
    const facultades = await this.facultadRepository.find({where: { id: In(ids) }});
    if (!facultades) throw new NotFoundException("No se encontraron facultades");
    return facultades;
  }

}
