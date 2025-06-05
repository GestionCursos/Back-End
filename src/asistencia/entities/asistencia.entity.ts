import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('asistencias')
export class Asistencia {
    @PrimaryGeneratedColumn({ name: "id_asistencia" })
    idAsistencia: number;
    @Column({ name: "porcentaje_asistencia" })
    porcentajeAsistencia: number;
    @OneToOne(()=>Inscripcion,(inscripcion)=>inscripcion.idInscripcion)
    @JoinColumn({name:"id_inscripcion"})
    idInscripcion:number;
}

