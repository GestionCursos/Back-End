import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Organizador")
export class Organizador {
    @PrimaryGeneratedColumn({name:"id_organizador"})
    id:number;
    @Column()
    nombre:string;
    @Column()
    institucion:string;
    @Column()
    correo:string;
}
