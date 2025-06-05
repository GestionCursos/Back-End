import { IsNumber, IsOptional } from "class-validator";

export class CreateAsistenciaDto {
    @IsOptional()
    @IsNumber()
    nota: number;
    @IsOptional()
    @IsNumber()
    asistencia: number;
    @IsNumber()
    idInscripcion: number;
}
