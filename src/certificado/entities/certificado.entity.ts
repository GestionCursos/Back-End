import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('certificados')
export class Certificado {
    @PrimaryGeneratedColumn({ name: 'id_certificado' })
    idCertificado:number;
    @OneToOne(()=>Inscripcion,(inscripcion)=>inscripcion.idInscripcion)
    @JoinColumn({name:'id_inscripcion'})
    idInscripcion:Inscripcion;
    @Column({name:'url_certificado'})
    urlCertificado:string;
}
