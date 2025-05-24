import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateDetalleErrorDto {
    @IsNumber()
    idSolicitud: number;
    @IsString()
    pasosReproduccion: string;
    @IsString()
    resultadoEsperado: string;
    @IsString()
    resultadoObservado: string;
    @IsDateString()
    fechaIncidente: Date;
    @IsString()
    frecuenciaError: string;
    @IsString()
    mensajeError: string;
    @IsString()
    sistemaNavegador: string;
    @IsString()
    urlError: string;
    @IsString()
    workaround: string;
}
