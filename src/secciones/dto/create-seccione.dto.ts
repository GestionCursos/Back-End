import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
export class CreateSeccioneDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
  @IsNotEmpty()
  @IsString()
  descripcion: string;
  @IsNotEmpty()
  @IsString()
  icono_url: string;

  
}
