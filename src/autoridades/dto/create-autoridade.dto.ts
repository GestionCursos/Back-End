import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateAutoridadeDto {
@IsNotEmpty()
@IsString()
nombre: string;
@IsNotEmpty()
@IsString()
cargo: string;
@IsNotEmpty()
@IsString()
descripcion: string;
@IsNotEmpty()
@IsString()
foto_url: string;
@IsNotEmpty()
@IsNumber()
orden: number;
@IsNotEmpty()
@IsBoolean()
visible: boolean;



}
