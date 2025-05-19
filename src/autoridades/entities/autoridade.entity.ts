    import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
@Entity("Autoridades")
export class Autoridade {

    @PrimaryGeneratedColumn()
    id_autoridad?: number;
    @Column()
    nombre: string;
    @Column()
    cargo: string;
    @Column()
    descripcion: string;
    @Column()
    foto_url: string;
    @Column()
    orden: number;
    @Column()
    visible: boolean;
}

