import { Module } from '@nestjs/common';
import { AutoridadesService } from './autoridades.service';
import { AutoridadesController } from './autoridades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autoridade } from './entities/autoridade.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Autoridade])],
  controllers: [AutoridadesController],
  providers: [AutoridadesService],
})
export class AutoridadesModule {}
