// src/registro-aprobacion/registro-aprobacion.entity.ts
import { Solicitud } from 'src/solicitud/entities/solicitud.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class RegistroAprobacion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Solicitud, solicitud => solicitud.idSolicitud, { eager: true })
    solicitud: Solicitud;

    @ManyToOne(() => Usuario, usuario => usuario.uid_firebase, { eager: true })
    usuario: Usuario;

    @Column({ type: 'varchar' })
    estado: 'Aprobado' | 'Rechazado';

    @Column({ type: 'text', nullable: true })
    justificacion?: string;

    @CreateDateColumn()
    fechaDecision: Date;
}
