import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultadService } from 'src/facultad/facultad.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly carreraService: FacultadService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto, Uid: string) {
    const carrera = await this.carreraService.findByNombre(createUsuarioDto.carrera);

    const usuario = this.usuarioRepository.create(createUsuarioDto);
    usuario.uid_firebase = Uid
    if (carrera) {
      usuario.idCarrera = carrera;
    }
    const savedUsuario = await this.usuarioRepository.save(usuario);
    return savedUsuario;
  }

  async findAll() {
    const buscarTodo = await this.usuarioRepository.find();
    if (!buscarTodo) {
      throw new NotFoundException("Error de Conexion");
    }
    return buscarTodo;
  }

  async findOne(id: string) {
    const buscarUno = await this.usuarioRepository.findOne({ where: { uid_firebase: id } });
    if (!buscarUno) {
      throw new NotFoundException("No se encontro al Usuario");
    }
    return buscarUno;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const upd = await this.usuarioRepository.update({ uid_firebase: id }, updateUsuarioDto);
    if (!upd) {
      throw new Error('Usuario not found');
    }
    return true;
  }

  async remove(id: string) {
    return await this.usuarioRepository.softDelete({ uid_firebase: id });
  }

  async findRol(id: string) {
    const userUid = await this.usuarioRepository.findOneBy({ uid_firebase: id });
    if (!userUid) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return {
      rol: userUid.rol,
      urlUserImg: userUid.url_foto,
      username: userUid.nombres + ' ' + userUid.apellidos,
    };
  }
}
