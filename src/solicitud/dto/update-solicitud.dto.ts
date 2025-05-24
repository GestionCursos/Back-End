import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudDto } from './create-solicitud.dto';
import { IsString } from 'class-validator';

export class UpdateSolicitudDto  {
    @IsString()
    estado: string;
}
