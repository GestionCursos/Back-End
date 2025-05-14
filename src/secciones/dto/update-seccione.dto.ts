import { PartialType } from '@nestjs/mapped-types';
import { CreateSeccioneDto } from './create-seccione.dto';

export class UpdateSeccioneDto extends PartialType(CreateSeccioneDto) {}
