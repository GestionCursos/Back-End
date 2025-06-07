import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeccioneDto } from './dto/create-seccione.dto';
import { UpdateSeccioneDto } from './dto/update-seccione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seccione } from './entities/seccione.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeccionesService {
  constructor(
    @InjectRepository(Seccione)
    private seccioneRepositiry: Repository<Seccione>,
  ) { }
  async create(createSeccioneDto: CreateSeccioneDto) {
    const guardarSeccion =
      await this.seccioneRepositiry.save(createSeccioneDto);
    if (!guardarSeccion) throw new NotFoundException("La seccion no se pudo guardar");
    return guardarSeccion;
  }

  async findAll() {
    const listaSecciones = await this.seccioneRepositiry.find({
      relations: ['eventos', 'eventos.requisitos'],
    });
    return listaSecciones;
  }

  async findAllCreateEvento() {
    const listaSecciones = await this.seccioneRepositiry.find();
    return listaSecciones;
  }


  async update(id: number, updateSeccioneDto: UpdateSeccioneDto) {
    const seccionModificado = await this.seccioneRepositiry.update(id, updateSeccioneDto);
    if (!seccionModificado) throw new NotFoundException("La seccion no se pudo actualizar");
    return seccionModificado;
  }

  async remove(id: number) {
    await this.seccioneRepositiry.delete(id);
    return true;
  }

  async findOne(id: number) {
    const seccion = await this.seccioneRepositiry.findOne({
      where: { id_seccion: id }, relations: ['eventos']
    });
    if (!seccion) throw new NotFoundException("La seccion no existe");
    return seccion;
  }
}