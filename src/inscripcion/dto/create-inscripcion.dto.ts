import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateInscripcionDto {
    @IsNumber()
    @IsNotEmpty()
    evento: number
    @IsString()
    @IsOptional()
    urlComprobantePago: string;
    @IsString()
    @IsOptional()
    urlCedulaPapeletaV: string;
    @IsString()
    @IsOptional()
    cartaMotivacion: string;
}