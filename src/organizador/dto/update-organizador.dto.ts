import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrganizadorDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;
}
