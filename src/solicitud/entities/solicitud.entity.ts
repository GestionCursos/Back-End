import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

 @Entity("Solicitudes")
export class Solicitud {
    @PrimaryGeneratedColumn({ name: "id_solicitud" })
    idSolicitud: number;
    @ManyToOne(() => Usuario, (usuario) => usuario.uid_firebase)
    @JoinColumn({ name: "id_user" })
    idUser: Usuario;
    @Column({ nullable: true })
    apartado?: string;
    @Column({ name: "tipo_cambio", nullable: true })
    tipoCambio?: string;
    @Column({ name: "otro_tipo", nullable: true })
    otroTipo?: string;
    @Column({ nullable: true })
    descripcion?: string;
    @Column({ nullable: true })
    justificacion?: string;
    @Column({ nullable: true })
    urgencia?: string;
    @Column({ nullable: true })
    archivo?: string;
    @Column({default:"Pendiente"})
    estado?:string;
    @Column({ nullable: true })
    colaboradorGithub?: string;
    @Column({ nullable: true })
    colaboradorGithubBackend?: string;
    @Column({ nullable: true })
    colaboradorGithubFrontend?: string;
    @Column({ nullable: true })
    ramaBackend?: string;
    @Column({ nullable: true })
    ramaFrontend?: string;
    @Column({ nullable: true })
    created_at?: string;
}
