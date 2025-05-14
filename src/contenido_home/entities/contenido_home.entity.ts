import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity("contenido_home")
export class ContenidoHome {
    @PrimaryColumn()
    id_contenido: number;
    @Column()
    titulo: string;
    @Column()
    descripcion: string;
    @Column()
    url_foto: string;
}
