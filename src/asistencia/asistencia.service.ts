import { Injectable } from '@nestjs/common';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { Nota } from './entities/nota.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
    @InjectRepository(Nota)
    private readonly notaRepository: Repository<Nota>
  ) { }
  async create(createAsistenciaDto: CreateAsistenciaDto) {
    const nota = await this.notaRepository.save({
      nota: createAsistenciaDto.nota,
      idInscripcion: createAsistenciaDto.idInscripcion

    })
    const asistencia = await this.asistenciaRepository.save({
      idInscripcion: createAsistenciaDto.idInscripcion,
      porcentajeAsistencia: createAsistenciaDto.asistencia
    })
    return true;
  }

}
