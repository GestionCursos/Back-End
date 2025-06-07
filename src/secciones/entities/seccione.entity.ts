import { Evento } from 'src/evento/entities/evento.entity';
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
@Entity("Secciones")
export class Seccione {
  @PrimaryGeneratedColumn()
  id_seccion?: number;
  @Column()
  nombre: string;
  @Column()
  descripcion: string;
  @Column()
  icono_url: string;

  @OneToMany(()=>Evento,(evento)=>evento.idSeccion)
  eventos:Evento[]
  @DeleteDateColumn({ name: 'fecha_eliminacion', nullable: true, default: null })
  fechaEliminacion?: Date;
}
