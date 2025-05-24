import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleErrorDto } from './dto/create-detalle-error.dto';
import { UpdateDetalleErrorDto } from './dto/update-detalle-error.dto';
import { DetalleError } from './entities/detalle-error.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitudService } from 'src/solicitud/solicitud.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class DetalleErrorService {
  constructor(
    @InjectRepository(DetalleError)
    private detalleRepository: Repository<DetalleError>,
    private readonly solicitudService: SolicitudService,
  ) {}
  async create(createDetalleErrorDto: CreateDetalleErrorDto) {
    const solicitud = await this.solicitudService.findOne(
      createDetalleErrorDto.idSolicitud,
    );
    const detalleErrorPreparado = this.detalleRepository.create({
      ...createDetalleErrorDto,
      idSolicitud: solicitud,
    });
    const detalleErrorCreado = await this.detalleRepository.save(
      detalleErrorPreparado,
    );
    return detalleErrorCreado;
  }

async findOne(id: number) {
  const detalle = await this.detalleRepository.findOne({
    where: { idDetalle: id },
    relations: ['idSolicitud'],
  });

  if (!detalle) {
    throw new NotFoundException(`No se encontró un detalle con id ${id}`);
  }

  return detalle;
}
  async findAll() {
  const detalles = await this.detalleRepository.find({
    relations: ['idSolicitud'], 
  });

  return detalles;
}
}
