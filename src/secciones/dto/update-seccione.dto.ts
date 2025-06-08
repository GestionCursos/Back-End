import { PartialType } from '@nestjs/mapped-types';
import { CreateSeccioneDto } from './create-seccione.dto';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateSeccioneDto extends PartialType(CreateSeccioneDto) {

}
