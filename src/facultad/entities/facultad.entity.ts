import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'facultades' })
export class Facultad {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', length: 50, nullable: false })
    nombre: string;
}
