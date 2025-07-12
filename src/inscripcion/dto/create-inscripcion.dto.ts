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
    urlCedula: string;
    @IsString()
    @IsOptional()
    urlPapeletaV: string;
    @IsString()
    @IsOptional()
    urlCartaMotivacion: string;
    @IsString()
    @IsOptional()
    urlTituloBachiller: string;
    @IsString()
    @IsOptional()
    urlFotoCarnet: string;
    @IsString()
    @IsOptional()
    urlFormulario: string;
    @IsString()
    @IsOptional()
    urlResidencia: string;
    @IsString()
    @IsOptional()
    urlcurriculum: string;
}