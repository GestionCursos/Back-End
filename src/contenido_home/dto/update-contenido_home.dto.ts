import { PartialType } from '@nestjs/mapped-types';
import { CreateContenidoHomeDto } from './create-contenido_home.dto';
import { IsNumber } from 'class-validator';

export class UpdateContenidoHomeDto extends PartialType(CreateContenidoHomeDto) {
    @IsNumber()
    id_contenido: number;
    
}
