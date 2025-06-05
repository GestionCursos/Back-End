import {
    IsString,
    IsNumber,
    IsUUID,
    IsIn,
    IsNotEmpty,
} from 'class-validator';

export class CreateRegistroDto {
    @IsNumber()
    idSolicitud: number;

    @IsIn(['Aprobado', 'Rechazado'])
    estado: 'Aprobado' | 'Rechazado';

    @IsString()
    @IsNotEmpty()
    justificacion: string;
}
