import { Evento } from 'src/evento/entities/evento.entity';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column()
  orden: number;
  @OneToMany(()=>Evento,(evento)=>evento.idSeccion)
  eventos:Evento[]
}
