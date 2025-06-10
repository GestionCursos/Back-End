import { Nota } from "src/asistencia/entities/nota.entity";
import { Certificado } from "src/certificado/entities/certificado.entity";
import { Evento } from "src/evento/entities/evento.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
    @Column({ name: "fecha_inscripcion" })
    fechaInscripcion: Date;
    @Column({ default: "Pendiente", name: "estado_inscripcion" })
    estadoInscripcion: string
    @OneToOne(() => Certificado, (certificado) => certificado.idInscripcion)
    certificado: Certificado;
    @OneToOne(() => Nota, (nota) => nota.idInscripcion)
    nota: Nota;

}
