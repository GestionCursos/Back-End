import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrganizadorDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;
    @IsNotEmpty()
    @IsString()
    institucion: string;
    @IsString()
    @IsNotEmpty()
    correo: string;
}
