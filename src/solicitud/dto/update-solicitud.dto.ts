import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudDto } from './create-solicitud.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSolicitudDto  {
    @IsString()
    @IsOptional()
    estado?: string;
    @IsString()
    @IsOptional()
    descripcion?: string;
    @IsString()
    @IsOptional()
    colaboradorGithub?: string;
    @IsString()
    @IsOptional()
    colaboradorGithubBackend?: string;
    @IsString()
    @IsOptional()
    colaboradorGithubFrontend?: string;
    @IsString()
    @IsOptional()
    ramaBackend?: string;
    @IsString()
    @IsOptional()
    ramaFrontend?: string;
    @IsString()
    @IsOptional()
    tipoCambio?: string;
    @IsString()
    @IsOptional()
    otroTipo?: string;
}
