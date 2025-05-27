import { Controller, Get, Inject, Injectable } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller('dashboard')
export class DashboardController {

    constructor(
        private readonly dashboarService: DashboardService
    ) { }

    @Get("datos")
    obtenerEstadisticas() {
        return this.dashboarService.datosDashboard();
    }
}