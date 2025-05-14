import { PartialType } from '@nestjs/mapped-types';
import { CreateAutoridadeDto } from './create-autoridade.dto';

export class UpdateAutoridadeDto extends PartialType(CreateAutoridadeDto) {}
