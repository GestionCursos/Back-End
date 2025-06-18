import { IsString } from "class-validator";

export class CreateSolicitudDto {
@IsString()
    idUser: string;
    @IsString()
    apartado: string;
    @IsString()
    tipoCambio: string;
    @IsString()
    otroTipo: string;
    @IsString()
    descripcion: string;
    @IsString()
    justificacion: string;
    @IsString()
    urgencia: string;
    @IsString()
    archivo: string;
    @IsString()
    colaboradorGithubBackend?: string;
    @IsString()
    colaboradorGithubFrontend?: string;
    @IsString()
    ramaBackend?: string;
    @IsString()
    ramaFrontend?: string;

}
