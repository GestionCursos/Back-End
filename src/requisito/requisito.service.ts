import { Module } from '@nestjs/common';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Requisito } from './entities/requisito.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RequisitoService {
  async findById(requisito: number) {
    const facultades = await this.requisitoRepository.findOneBy({ idRequisito: requisito });
    if (!facultades) throw new NotFoundException("No se encontraron facultades");
    return facultades;
  }

  constructor(@InjectRepository(Requisito)
  private readonly requisitoRepository: Repository<Requisito>) { }

  async findAll() {
    const requisitos = await this.requisitoRepository.find();
    if (!requisitos) throw new NotFoundException("No se pudo establcer conexion con base de datos");
    return requisitos.map((req) => ({
      id: req.idRequisito,
      nombre: req.nombre
    }));
  }

  async findByIds(ids: number[]) {
    const facultades = await this.requisitoRepository.find({ where: { idRequisito: In(ids) } });
    if (!facultades) throw new NotFoundException("No se encontraron facultades");
    return facultades;
  }

}