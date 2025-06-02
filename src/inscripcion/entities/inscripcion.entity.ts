import { Evento } from "src/evento/entities/evento.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Inscripciones')
export class Inscripcion {
    @PrimaryGeneratedColumn({ name: 'id_inscripcion' })
    idInscripcion: number;
    @ManyToOne(() => Usuario, (usuario) => usuario.uid_firebase)
    @JoinColumn({ name: "id_usuario" })
    usuario: Usuario
    @ManyToOne(() => Evento, (evento) => evento.id_evento)
    @JoinColumn({ name: "id_evento" })
    evento: Evento
    @Column({ name: "fecha_inscripcion"})
    fechaInscripcion: Date;
    @Column({ default: "Pendiente", name: "estado_inscripcion"})
    estadoInscripcion: string
}
