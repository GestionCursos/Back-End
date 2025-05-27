import { Injectable } from "@nestjs/common";
import { EventoService } from "src/evento/evento.service";
import { UsuarioService } from "src/usuario/usuario.service";
import { json } from "stream/consumers";

@Injectable()
export class DashboardService {

    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly eventoService: EventoService
    ) { }

    async datosDashboard() {
        const usuariosRegistrados = await this.usuarioService.findAll();
        const totalEventos = await this.eventoService.findAll();
        const eventosRecientesRaw = await this.eventoService.obtenerUltimos();
        const eventosRecientes = eventosRecientesRaw.map((evento) => ({
            nombre: evento.nombre,
            visible: evento.visible ? "ACTIVADO" : "DESACTIVADO",
        }));


        return {
            TotalEventos: totalEventos.length,
            UsuariosRegistrados: usuariosRegistrados.length,
            eventosRecientes: eventosRecientes
        };
    }
}