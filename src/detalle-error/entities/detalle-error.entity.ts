import { Solicitud } from "src/solicitud/entities/solicitud.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity("detalle_errores")
export class DetalleError {
    @PrimaryGeneratedColumn({ name: "id_detalle" })
    idDetalle: number;
    @OneToOne(() => Solicitud, (solicitud) => solicitud.idSolicitud)
    @JoinColumn({ name: "id_solicitud" })
    idSolicitud: Solicitud;
    @Column({ name: "pasos_reproduccion" })
    pasosReproduccion: string;
    @Column({ name: "resultado_esperado" })
    resultadoEsperado: string;
    @Column({ name: "resultado_observado" })
    resultadoObservado: string;
    @Column({ name: "fecha_insidente" })
    fechaIncidente: Date;
    @Column({ name: "frecuencia_error" })
    frecuenciaError: string;
    @Column({name:"mensaje_error"})
    mensajeError:string;
    @Column({name:"sistema_navegador"})
    sistemaNavegador:string;
    @Column({name:"url_error"})
    urlError:string;
    @Column()
    workaround:string;

}
