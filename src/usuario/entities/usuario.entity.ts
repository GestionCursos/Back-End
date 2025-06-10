import { Facultad } from 'src/facultad/entities/facultad.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('Usuarios')
export class Usuario {
  @PrimaryColumn()
  uid_firebase: string;

  @Column({ name: 'nombres' })
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  correo: string;

  @Column()
  telefono: string;

  @Column()
  direccion: string;

  @Column()
  rol: string;

  @Column()
  estado: string;

  @Column()
  url_foto: string;
  @DeleteDateColumn({
    name: 'fecha_eliminacion',
    nullable: true,
    default: null,
  })
  fechaEliminacion?: Date;

  @ManyToOne(() => Facultad, (facultad) => facultad.id, { nullable: true })
  idCarrera: Facultad;
}
