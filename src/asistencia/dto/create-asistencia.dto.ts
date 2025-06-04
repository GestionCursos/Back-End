import { IsNumber } from "class-validator";

export class CreateAsistenciaDto {
    @IsNumber()
    nota: number;
    @IsNumber()
    asistencia: number;
    @IsNumber()
    idInscripcion: number;
}
