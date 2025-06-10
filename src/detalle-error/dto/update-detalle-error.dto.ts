import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleErrorDto } from './create-detalle-error.dto';

export class UpdateDetalleErrorDto extends PartialType(CreateDetalleErrorDto) {}
