import { IsNumber, IsString } from "class-validator";

export class CreateRequisitoInscripcionDto {
    @IsNumber()
    inscripcion: number;
    @IsNumber()
    requisito: number;
    @IsString()
    urlRequisito: string;
}
