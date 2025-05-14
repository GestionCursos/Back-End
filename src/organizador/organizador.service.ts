import { Injectable } from '@nestjs/common';
import { CreateOrganizadorDto } from './dto/create-organizador.dto';
import { UpdateOrganizadorDto } from './dto/update-organizador.dto';

@Injectable()
export class OrganizadorService {
  create(createOrganizadorDto: CreateOrganizadorDto) {
    return 'This action adds a new organizador';
  }

  findAll() {
    return `This action returns all organizador`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organizador`;
  }

  update(id: number, updateOrganizadorDto: UpdateOrganizadorDto) {
    return `This action updates a #${id} organizador`;
  }

  remove(id: number) {
    return `This action removes a #${id} organizador`;
  }
}
