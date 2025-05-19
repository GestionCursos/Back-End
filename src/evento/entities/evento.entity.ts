import { Organizador } from "src/organizador/entities/organizador.entity";
import { Seccione } from "src/secciones/entities/seccione.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Eventos")
export class Evento {
    @PrimaryGeneratedColumn()
    id_evento: number;
    @Column()
    nombre: string;
    @Column({ name: "tipo_evento" })
    tipoEvento: string;
    @Column({ name: "fecha_inicio" })
    fechaInicio: Date;
    @Column({ name: "fecha_fin" })
    fechaFin: Date;
    @Column()
    modalidad: string;
    @Column()
    costo: number;
    @Column()
    categoria: string;
    @Column({ name: "numero_horas" })
    numeroHoras: string;
    @Column({ name: "nota_aprovacion" })
    notaAprovacion: number;
    @Column({ name: "requiere_asistencia" })
    requiereAsistencia: boolean;
    @Column({name:"url_foto"})
    urlFoto:string;
    @Column()
    visible:boolean;
    @Column()
    descripcion:string;
    @ManyToOne(()=>Organizador,(organizador)=>organizador.id)
    @JoinColumn({name:"id_organizador"})
    idOrganizador:Organizador;

    @ManyToOne(()=>Seccione,(seccion)=>seccion.id_seccion)
    @JoinColumn({name:"id_seccion"})
    idSeccion:Seccione;
    @DeleteDateColumn({ name: 'fecha_eliminacion', nullable: true ,default:null})
    fechaEliminacion?: Date;

}
