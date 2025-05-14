import { PartialType } from '@nestjs/mapped-types';
import { CreateContenidoHomeDto } from './create-contenido_home.dto';

export class UpdateContenidoHomeDto extends PartialType(CreateContenidoHomeDto) {}
