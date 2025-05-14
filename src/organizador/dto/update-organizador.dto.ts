import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizadorDto } from './create-organizador.dto';

export class UpdateOrganizadorDto extends PartialType(CreateOrganizadorDto) {}
