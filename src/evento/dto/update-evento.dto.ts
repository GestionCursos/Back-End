import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min } from 'class-validator';

export class UpdateEventoDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    tipoEvento?: string;

    @IsOptional()
    @IsDateString()
    fechaInicio?: Date;

    @IsOptional()
    @IsDateString()
    fechaFin?: Date;

    @IsOptional()
    @IsString()
    modalidad?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    costo?: number;

    @IsOptional()
    @IsString()
    categoria?: string;

    @IsOptional()
    @IsNumber()
    numeroHoras?: number;

    @IsOptional()
    @IsNumber()
    notaAprovacion?: number;

    @IsOptional()
    @IsNumber()
    requiereAsistencia?: number;

    @IsOptional()
    @IsString()
    urlFoto?: string;

    @IsOptional()
    @IsBoolean()
    visible?: boolean;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsNumber()
    idOrganizador?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    idSeccion?: number;

    @IsOptional()
    @IsNumber({}, { each: true })
    facultades?: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    requisitos?: number[];
}
