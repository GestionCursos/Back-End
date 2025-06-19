import { IsString, IsOptional } from "class-validator";

export class CreateSolicitudDto {
  @IsString()
  idUser: string;
  @IsString()
  apartado: string;
  @IsString()
  tipoCambio: string;
  @IsString()
  @IsOptional()
  otroTipo?: string;
  @IsString()
  descripcion: string;
  @IsString()
  justificacion: string;
  @IsString()
  urgencia: string;
  @IsString()
  archivo: string;
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
}
