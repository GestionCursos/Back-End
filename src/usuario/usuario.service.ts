import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    const savedUsuario = await this.usuarioRepository.save(usuario);
    return savedUsuario;
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  findOne(id: string) {
    return this.usuarioRepository.findOne({ where: { uid_firebase: id } });
  }

  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const upd = this.usuarioRepository.update({ uid_firebase: id }, updateUsuarioDto);
    if (!upd) {
      throw new Error('Usuario not found');
    }
    return true;
  }

  remove(id: string) {
    return this.usuarioRepository.softDelete({ uid_firebase: id });
  }
}
