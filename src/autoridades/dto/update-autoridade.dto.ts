import { PartialType } from '@nestjs/mapped-types';
import { CreateAutoridadeDto } from './create-autoridade.dto';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateAutoridadeDto extends PartialType(CreateAutoridadeDto) {
  
}
