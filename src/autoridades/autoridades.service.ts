import { Injectable } from '@nestjs/common';
import { CreateAutoridadeDto } from './dto/create-autoridade.dto';
import { UpdateAutoridadeDto } from './dto/update-autoridade.dto';

@Injectable()
export class AutoridadesService {
  create(createAutoridadeDto: CreateAutoridadeDto) {
    return 'This action adds a new autoridade';
  }

  findAll() {
    return `This action returns all autoridades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} autoridade`;
  }

  update(id: number, updateAutoridadeDto: UpdateAutoridadeDto) {
    return `This action updates a #${id} autoridade`;
  }

  remove(id: number) {
    return `This action removes a #${id} autoridade`;
  }
}
