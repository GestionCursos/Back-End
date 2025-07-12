
import { IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto {
    @IsOptional()
    @IsString()
    nombres: string;

    @IsOptional()
    @IsString()
    apellidos: string;

    @IsOptional()
    @IsString()
    correo: string;

    @IsOptional()
    @IsString()
    telefono: string;

    @IsOptional()
    @IsString()
    direccion: string;

    @IsOptional()
    @IsString()
    rol: string;

    @IsOptional()
    @IsString()
    carrera: string;

    @IsOptional()
    @IsString()
    estado: string;

    @IsOptional()
    @IsString()
    url_foto: string;

    @IsOptional()
    @IsString()
    cedula: string;

}
