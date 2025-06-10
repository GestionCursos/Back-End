import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
@Entity("contenido_home")
export class ContenidoHome {
    @PrimaryGeneratedColumn()
    id_contenido?: number;
    @Column()
    titulo: string;
    @Column()
    descripcion: string;
    @Column()
    url_foto: string;
}
