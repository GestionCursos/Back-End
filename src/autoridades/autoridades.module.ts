import { Module } from '@nestjs/common';
import { AutoridadesService } from './autoridades.service';
import { AutoridadesController } from './autoridades.controller';

@Module({
  controllers: [AutoridadesController],
  providers: [AutoridadesService],
})
export class AutoridadesModule {}
