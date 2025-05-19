import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Seccione {
  @PrimaryGeneratedColumn()
  id_seccion?: number;
  @Column()
  nombre: string;
  @Column()
  cargo: string;
  @Column()
  descripcion: string;
  @Column()
  icono_url: string;
  @Column()
  orden: number;
  @Column()
  visible: boolean;
}
