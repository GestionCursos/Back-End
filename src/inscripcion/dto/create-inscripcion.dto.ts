import { IsNumber, IsString } from "class-validator"

export class CreateInscripcionDto {
    @IsNumber()
    evento: number
}
