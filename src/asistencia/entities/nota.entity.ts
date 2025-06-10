import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inscripcion } from "../../inscripcion/entities/inscripcion.entity";

@Entity('notas')
export class Nota{
    @PrimaryGeneratedColumn({name:"id_nota"})
    idNota:number;
    @OneToOne(()=>Inscripcion,(inscripcion)=>inscripcion.idInscripcion)
    @JoinColumn({name:"id_inscripcion"})
    idInscripcion:number
    @Column()
    nota:number



}