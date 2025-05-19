import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

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
    @IsString()
    @IsNotEmpty()
    costo: number;
    @IsString()
    @IsNotEmpty()
    categoria: string;
    @IsString()
    @IsNotEmpty()
    numeroHoras: string;
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
    idSeeccion:number
}
