import { Evento } from "src/evento/entities/evento.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'facultades' })
export class Facultad {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', length: 50, nullable: false })
    nombre: string;
    @ManyToMany(() => Evento, (evento) => evento.facultades)
    eventos: Evento[];
}
