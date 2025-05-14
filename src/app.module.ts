import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { ContenidoHomeModule } from './contenido_home/contenido_home.module';
import { AutoridadesModule } from './autoridades/autoridades.module';
import { SeccionesModule } from './secciones/secciones.module';
import { RequisitoModule } from './requisito/requisito.module';
import { RequisitoEventoModule } from './requisito_evento/requisito_evento.module';
import { RequisitoInscripcionModule } from './requisito_inscripcion/requisito_inscripcion.module';
import { EventoModule } from './evento/evento.module';
import { OrganizadorModule } from './organizador/organizador.module';
import { NotaModule } from './nota/nota.module';
import { CertificadoModule } from './certificado/certificado.module';
import { UsuarioModule } from './usuario/usuario.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
@Module({
  imports: [FirebaseModule, ContenidoHomeModule, AutoridadesModule, SeccionesModule, RequisitoModule, RequisitoEventoModule, RequisitoInscripcionModule, EventoModule, OrganizadorModule, NotaModule, CertificadoModule, UsuarioModule, InscripcionModule, AsistenciaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
