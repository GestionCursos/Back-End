import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudDto } from './create-solicitud.dto';
import { IsString } from 'class-validator';

export class UpdateSolicitudDto  {
    @IsString()
    estado: string;
    @IsString()
    descripcion:string;
    @IsString()
    colaboradorGithub?: string;
    @IsString()
    colaboradorGithubBackend?: string;
    @IsString()
    colaboradorGithubFrontend?: string;
    @IsString()
    ramaBackend?: string;
    @IsString()
    ramaFrontend?: string;
}
