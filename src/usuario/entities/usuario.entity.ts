import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("Usuarios")
export class Usuario {
    @PrimaryColumn()
    uid_firebase: string;
  
    @Column({name: "nombres"})
    nombres: string;
  
    @Column()
    apellidos: string;
  
    @Column()
    correo: string;
  
    @Column()
    password: string;
  
    @Column()
    telefono: string;
  
    @Column()
    direccion: string;
  
    @Column()
    rol: string;
  
    @Column()
    carrera: string;
  
    @Column()
    estado: string;
  
    @Column()
    url_foto: string;
}
