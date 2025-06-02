import { RequisitoService } from './requisito.service';
import { RequisitoController } from './requisito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requisito } from './entities/requisito.entity';
import { Module } from '@nestjs/common';

@Module({
  imports:[TypeOrmModule.forFeature([Requisito])],
  controllers: [RequisitoController],
  providers: [RequisitoService],
  exports:[RequisitoService]
})
export class RequisitoModule {}
