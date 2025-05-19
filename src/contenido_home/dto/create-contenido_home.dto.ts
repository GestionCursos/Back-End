import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContenidoHomeDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;
  @IsNotEmpty()
  @IsString()
  descripcion: string;
  @IsNotEmpty()
  @IsString()
  url_foto: string;
}
