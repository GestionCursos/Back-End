import { Module } from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { CertificadoController } from './certificado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificado } from './entities/certificado.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { InscripcionModule } from 'src/inscripcion/inscripcion.module';
import { EventoModule } from 'src/evento/evento.module';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  imports:[TypeOrmModule.forFeature([Certificado]),FirebaseModule,InscripcionModule,EventoModule],
  controllers: [CertificadoController],
  providers: [CertificadoService,PdfService],
})
export class CertificadoModule {}
