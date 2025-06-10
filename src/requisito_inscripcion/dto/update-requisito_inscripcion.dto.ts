import { PartialType } from '@nestjs/mapped-types';
import { CreateRequisitoInscripcionDto } from './create-requisito_inscripcion.dto';

export class UpdateRequisitoInscripcionDto extends PartialType(CreateRequisitoInscripcionDto) {}
