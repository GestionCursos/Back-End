import { Module } from '@nestjs/common';
import { NotaService } from './nota.service';
import { NotaController } from './nota.controller';

@Module({
  controllers: [NotaController],
  providers: [NotaService],
})
export class NotaModule {}
