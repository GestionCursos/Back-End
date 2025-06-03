import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Requisito } from "src/requisito/entities/requisito.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('requisito_inscripcion')
export class RequisitoInscripcion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.idInscripcion)
    @JoinColumn({ name: 'inscripcion_id' })
    inscripcion: Inscripcion;

    @ManyToOne(() => Requisito, (requisito) => requisito.idRequisito)
    @JoinColumn({ name: 'requisito_id' })
    requisito: Requisito;


    @Column({ type: 'varchar', nullable: true })
    urlRequisito: string;
}

