import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

 @Entity("Solicitudes")
export class Solicitud {
    @PrimaryGeneratedColumn({ name: "id_solicitud" })
    idSolicitud: number;
    @ManyToOne(() => Usuario, (usuario) => usuario.uid_firebase)
    @JoinColumn({ name: "id_user" })
    idUser: Usuario;
    @Column()
    apartado: string;
    @Column({ name: "tipo_cambio" })
    tipoCambio: string;
    @Column({ name: "otro_tipo" })
    otroTipo: string;
    @Column()
    descripcion: string;
    @Column()
    justificacion: string;
    @Column()
    urgencia: string;
    @Column()
    archivo:string;
    @Column({default:"Pendiente"})
    estado?:string;}
