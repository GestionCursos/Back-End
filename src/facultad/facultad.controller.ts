import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacultadService } from './facultad.service';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { UpdateFacultadDto } from './dto/update-facultad.dto';

@Controller('facultad')
export class FacultadController {
  constructor(private readonly facultadService: FacultadService) { }
}
