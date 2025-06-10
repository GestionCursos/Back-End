import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCertificadoDto {
    @IsNumber()
    @IsNotEmpty()
    idEvento: number;
}