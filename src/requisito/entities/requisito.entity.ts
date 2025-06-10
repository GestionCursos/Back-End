import { Evento } from "src/evento/entities/evento.entity";
import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('requisitos')
export class Requisito {
    @PrimaryGeneratedColumn({ name: "id_requisito" })
    idRequisito: number;
    @Column()
    nombre: string;
    @ManyToMany(() => Evento, (evento) => evento.requisitos)
    eventos: Evento[]

}
