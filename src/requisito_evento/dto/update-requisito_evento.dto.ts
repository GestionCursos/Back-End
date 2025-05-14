import { PartialType } from '@nestjs/mapped-types';
import { CreateRequisitoEventoDto } from './create-requisito_evento.dto';

export class UpdateRequisitoEventoDto extends PartialType(CreateRequisitoEventoDto) {}
