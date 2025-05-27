import { Module } from "@nestjs/common";
import { EventoModule } from "src/evento/evento.module";
import { UsuarioModule } from "src/usuario/usuario.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
    imports: [UsuarioModule, EventoModule],
    controllers:[DashboardController],
    providers:[DashboardService]
})

export class DashboardModule { }