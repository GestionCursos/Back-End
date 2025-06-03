import { ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateEventoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    @IsString()
    @IsNotEmpty()
    tipoEvento: string;
    @IsDateString()
    @IsNotEmpty()
    fechaInicio: Date;
    @IsDateString()
    @IsNotEmpty()
    fechaFin: Date;
    @IsString()
    @IsNotEmpty()
    modalidad: string;
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    costo: number;
    @IsString()
    @IsNotEmpty()
    categoria: string;
    @IsNumber()
    @IsNotEmpty()
    numeroHoras: number;
    @IsNumber()
    @IsNotEmpty()
    notaAprovacion: number;
    @IsBoolean()
    @IsNotEmpty()
    requiereAsistencia: boolean;
    @IsString()
    @IsNotEmpty()
    urlFoto: string;
    @IsBoolean()
    @IsNotEmpty()
    visible: boolean;
    @IsString()
    @IsNotEmpty()
    descripcion: string;
    @IsNumber()
    @IsNotEmpty()
    idOrganizador: number;
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    idSeccion: number
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    facultades: number[];
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    requisitos: number[];
}
