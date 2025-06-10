import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  rol: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  carrera: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  url_foto: string;
}
