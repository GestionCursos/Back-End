import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInscripcionDto {
    @IsString()
    @IsNotEmpty()
    estado: string;
}

