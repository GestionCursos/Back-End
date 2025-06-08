import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequisitoInscripcionDto } from './dto/create-requisito_inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequisitoInscripcion } from './entities/requisito_inscripcion.entity';
import { DataSource, Repository } from 'typeorm';
import { InscripcionService } from 'src/inscripcion/inscripcion.service';
import { RequisitoService } from 'src/requisito/requisito.service';
import { NotFoundError } from 'rxjs';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';

@Injectable()
export class RequisitoInscripcionService {
  constructor(
    @InjectRepository(RequisitoInscripcion)
    private readonly riRepository: Repository<RequisitoInscripcion>,
    private readonly requisitoService: RequisitoService,
    private readonly dataSource: DataSource,  // inyectamos DataSource para hacer consultas directas

  ) { }
  async create(createRequisitoInscripcionDto: {inscripcion: Inscripcion, requisito: number, urlRequisito: string}) {
    const requisito = await this.requisitoService.findById(createRequisitoInscripcionDto.requisito);
    const isPreparado = this.riRepository.create({
      ...createRequisitoInscripcionDto,
      inscripcion: createRequisitoInscripcionDto.inscripcion,
      requisito,
    })
    const isGuardado = await this.riRepository.save(isPreparado);
    if (!isGuardado) throw new NotFoundException("Error de conexion");
    return isGuardado;
  }

  async printQueryResults() {
    // Consulta 1
    const usuariosInscripciones = await this.dataSource.query(`
      select u.nombres,i.estado_inscripcion,
      i.id_evento,i.id_inscripcion,
      e.nombre as "nombre del evento" 
      from "Usuarios" u inner join "Inscripciones" i
       on u.uid_firebase =i.id_usuario 
       inner join "Eventos" e on e.id_evento=i.id_evento 
       	where i.estado_inscripcion ='Pendiente';
;
    `);

    // Consulta 2
    const requisitoInscripcion = await this.dataSource.query(`
      SELECT ri.inscripcion_id, r.nombre,ri."urlRequisito"
      FROM requisito_inscripcion ri
      INNER JOIN requisitos r ON ri.requisito_id = r.id_requisito;
    `);

    // Consulta 3
    const requisitos = await this.dataSource.query(`
    select r.id_requisito,r.nombre as "nombre del requisito" from requisitos r ;    
`);


    const json = { usuariosInscripciones: usuariosInscripciones, requisitoInscripcion: requisitoInscripcion, requisitos: requisitos }


    // Columnas iniciales: id_inscripcion, nombre, estado, curso
    const columnas = [
      "id_inscripcion",
      "nombre",
      "estadoInscripcion",
      "curso",
      ...json.requisitos.map(r => r["nombre del requisito"])
    ];

    // Construcción de la tabla
    const tabla = json.usuariosInscripciones.map(usuario => {
      const fila: Record<string, string> = {
        id_inscripcion: usuario.id_inscripcion.toString(),
        nombre: usuario.nombres,
        estadoInscripcion: usuario.estado_inscripcion,
        curso: usuario["nombre del evento"]
      };

      // Inicializa columnas de requisitos como vacías
      for (const requisito of json.requisitos) {
        fila[requisito["nombre del requisito"]] = "";
      }

      // Llenar requisitos entregados por el usuario
      const entregados = json.requisitoInscripcion.filter(
        ri => ri.inscripcion_id === usuario.id_inscripcion
      );

      for (const entregado of entregados) {
        fila[entregado.nombre] = entregado.urlRequisito || "";
      }

      return fila;
    });

    return tabla;
  }

}