import { IsString } from "class-validator";

export class CreateFacultadDto {
    @IsString()
    nombre: string;
}
