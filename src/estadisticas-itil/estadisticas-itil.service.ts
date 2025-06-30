import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { DataSource } from 'typeorm';

@Injectable()
export class EstadisticasItilService {

    constructor(
        private readonly dataSource: DataSource,
    ) { }
    async obtenerDesarrolladores() {
        const data = await this.dataSource.query(`
    SELECT
        s."colaboradorGithubBackend",
        s."colaboradorGithubFrontend"
    FROM "Solicitudes" s
    WHERE s."colaboradorGithubBackend" IS NOT NULL
       OR s."colaboradorGithubFrontend" IS NOT NULL;
`);

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const org = process.env.GITHUB_OWNER || 'GestionCursos';

        try {
            const miembros: any[] = [];
            let page = 1;
            let seguir = true;

            while (seguir) {
                const { data: miembrosData } = await octokit.orgs.listMembers({
                    org,
                    per_page: 100,
                    page,
                });

                if (miembrosData.length === 0) {
                    seguir = false;
                } else {
                    miembros.push(...miembrosData);
                    page++;
                }
            }

            const contadorUsuarios: Record<string, number> = {};
            data.forEach(solicitud => {
                const { colaboradorGithubBackend, colaboradorGithubFrontend } = solicitud;

                if (colaboradorGithubBackend) {
                    contadorUsuarios[colaboradorGithubBackend] = (contadorUsuarios[colaboradorGithubBackend] || 0) + 1;
                }

                if (colaboradorGithubFrontend) {
                    contadorUsuarios[colaboradorGithubFrontend] = (contadorUsuarios[colaboradorGithubFrontend] || 0) + 1;
                }
            });

            // Función para asignar especialidad según el nombre
            const obtenerEspecialidad = (nombre: string): string => {
                switch (nombre) {
                    case 'AdrianR0112':
                    case 'Jaml888':
                        return 'Frontend';
                    case 'SteevenToala':
                        return 'Fullstack';
                    case 'Alexande6055':
                        return 'Fullstack';
                    case 'ALEXK230':
                        return 'Backend';
                    default:
                        return 'Cliente/Asesor';
                }
            };

            const usuarios: Colaborador[] = miembros.map(user => ({
                nombre: user.login,
                avatar: user.avatar_url,
                cambios: contadorUsuarios[user.login] || 0,
                aprobacion: 0, // Por definir
                especialidad: obtenerEspecialidad(user.login),
                tendencia: 'Estable' // Por definir
            }));

            return { usuarios };
        } catch (error) {
            return {
                error: 'No se pudieron obtener los desarrolladores',
                details: error.message
            };
        }
    }

    async obtenerCambiosRecientes() {
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const org = process.env.GITHUB_OWNER || 'GestionCursos';

        try {
            const solicitudes = await this.dataSource.query(`
                SELECT 
                    case
                            when s."ramaBackend" is not null and s."ramaFrontend" is not null then s."ramaBackend" || ' + ' || s."ramaFrontend"
                            when s."ramaBackend" is not null then s."ramaBackend"
                            when s."ramaFrontend" is not null then s."ramaFrontend"
                            else null  -- opcional, ya que el WHERE evita que ambos sean nulos
                    end as "id",
                    s."descripcion",
                    s."estado",
                    s."urgencia",
                    s."colaboradorGithubBackend",
                    s."colaboradorGithubFrontend",
                    s."ramaBackend",
                    s."ramaFrontend",
                    s."created_at"
                FROM "Solicitudes" s
                WHERE s."estado" IS NOT NULL 
                  AND (s."colaboradorGithubBackend" IS NOT NULL OR s."colaboradorGithubFrontend" IS NOT NULL)
                ORDER BY s."created_at" DESC
                LIMIT 10;
            `);

            const cambiosRecientes = solicitudes.map((s, index) => {
                let tipo: string;
                if (s.id.includes(' + ')) {
                    tipo = 'Backend + Frontend';
                } else if (s.ramaBackend) {
                    tipo = 'Backend';
                } else {
                    tipo = 'Frontend';
                }
                const desarrollador = s.colaboradorGithubBackend || s.colaboradorGithubFrontend;

                return {
                    id: `${s.id}`,
                    titulo: this.extraerTitulo(s.descripcion),
                    desarrollador,
                    tipo,
                    estado: s.estado,
                    prioridad: s.urgencia,
                    fecha: s.created_at
                };
            });

            return { cambiosRecientes };
        } catch (error) {
            return {
                error: 'No se pudieron obtener los cambios recientes',
                details: error.message
            };
        }
    }

    private extraerTitulo(descripcion: string): string {
        if (!descripcion) return 'Cambio sin título';
        const lineas = descripcion.split('\n').map(l => l.trim()).filter(l => l.length > 10);
        return lineas[0]?.slice(0, 80) || 'Actualización de sistema';
    }

    async obtenerEstadisticasEstadoCambio() {
        const estadisticas = await this.dataSource.query(`
        select
            s.estado as estado,
            coalesce(counts.total_solicitudes, 0) as total_solicitudes
        from
            (
        values 
                ('Completado'),
                ('En Proceso'),
                ('Pendiente'),
                ('Rechazado')
        ) as s(estado)
        left join (
            select
                estado_transformado as estado,
                COUNT(*) as total_solicitudes
            from
                (
                select
                    case
                        when estado = 'Implementando' then 'En Proceso'
                        when estado = 'Cancelado' then 'Rechazado'
                        else estado
                    end as estado_transformado
                from
                    "Solicitudes"
                where
                    estado in ('Implementando', 'Cancelado', 'Pendiente', 'Completado', 'Rechazado')
            ) as sub
            group by
                estado_transformado
        ) as counts
        on
            s.estado = counts.estado
        order by
            s.estado;
    `);

        // Mapeo de colores y nombres
        const colores = {
            Completado: '#10b981',
            'En Proceso': '#f59e0b',
            Pendiente: '#6366f1',
            Rechazado: '#ef4444',
            Cancelado: '#9ca3af' // Gris opcional
        };

        const nombreEstado = (estado: string): string => {
            return estado === 'Implementando' ? 'En Proceso' : estado === 'Cancelado' ? 'Rechazado' : estado;
        };

        // Convertimos a formato con nombre + color
        const datos = estadisticas.map(es => {
            const estado = nombreEstado(es.estado);
            const valor = parseInt(es.total_solicitudes, 10);
            return {
                estado,
                valor,
                color: colores[estado] || '#6b7280'
            };
        });

        // Calcular total
        const total = datos.reduce((acc, cur) => acc + cur.valor, 0);

        // Calcular porcentaje por estado
        return datos.map(d => ({
            ...d,
            porcentaje: total > 0 ? parseFloat(((d.valor / total) * 100).toFixed(1)) : 0
        }));
    }

    async obtenerDatosEvolucion() {
        const data = await this.dataSource.query(`
        select
            TO_CHAR(DATE_TRUNC('day', TO_TIMESTAMP(created_at, 'YYYY-MM-DD HH24:MI:SS.MS')), 'DD Mon') as fecha,
            COUNT(*) as solicitudes,
            COUNT(*) filter (
        where
            estado = 'Implementando'
            or estado = 'Completado'
            ) as aprobadas,
            COUNT(*) filter (
        where
            estado = 'Cancelado'
            ) as rechazadas,
            COUNT(*) filter (
        where
            estado = 'Pendiente'
            ) as pendientes
        from
            "Solicitudes"
        group by
            DATE_TRUNC('day', TO_TIMESTAMP(created_at, 'YYYY-MM-DD HH24:MI:SS.MS'))
        order by
            DATE_TRUNC('day', TO_TIMESTAMP(created_at, 'YYYY-MM-DD HH24:MI:SS.MS'));    
        `)

        return data;

    }

    async obtenerTiposCambios() {
        const data = await this.dataSource.query(`
        SELECT 
            otro_tipo AS tipo,
            COUNT(*) AS cantidad
        FROM
            "Solicitudes"
        WHERE 
            estado NOT IN('Cancelado', 'Rechazado') AND
            otro_tipo IS NOT NULL AND
            TRIM(otro_tipo) <> ''
        GROUP BY
            otro_tipo     
        ORDER BY 
            cantidad DESC;
    `);

        // Acumular totales por tipo ITIL: Normal, Estándar, Emergencia
        const acumulador: Record<string, number> = {
            Normal: 0,
            Estandar: 0,
            Emergencia: 0,
        };

        for (const item of data) {
            const tipoLower = item.tipo?.toLowerCase() || '';

            if (tipoLower.includes('emergencia') || tipoLower.includes('emergente')) {
                acumulador.Emergencia += parseInt(item.cantidad);
            } else if (tipoLower.includes('estandar') || tipoLower.includes('estándar')) {
                acumulador.Estandar += parseInt(item.cantidad);
            } else {
                acumulador.Normal += parseInt(item.cantidad);
            }
        }

        // Mapeo con iconos y colores según ITIL
        const metaTipos: Record<string, { icono: string; color: string }> = {
            Normal: { icono: 'CheckCircle', color: '#10b981' },      // verde
            Estandar: { icono: 'ClipboardCheck', color: '#3b82f6' }, // azul
            Emergencia: { icono: 'AlertTriangle', color: '#ef4444' } // rojo
        };

        // Convertir a array ordenado y con metadatos
        const salida = Object.entries(acumulador)
            .map(([tipo, cantidad]) => {
                const meta = metaTipos[tipo];
                return {
                    tipo,
                    cantidad,
                    icono: meta.icono,
                    color: meta.color
                };
            })
            .sort((a, b) => b.cantidad - a.cantidad);

        return salida;
    }

    async obtenerDatosAuditoria() {
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const org = process.env.GITHUB_OWNER || 'GestionCursos';
        const backendRepo = process.env.GITHUB_BACKEND_REPO || 'Back-End';
        const frontendRepo = process.env.GITHUB_FRONTEND_REPO || 'Front-End';

        try {
            const solicitudes = await this.dataSource.query(`
                SELECT
                    s.id_solicitud AS "ID",
                    s.apartado AS "Módulo",
                    s.tipo_cambio AS "Tipo de Cambio",
                    COALESCE(s.otro_tipo, '') AS "Otro Tipo",
                    s.descripcion AS "Descripción",
                    s.justificacion AS "Justificación",
                    s.urgencia AS "Urgencia",
                    s.estado AS "Estado",
                    s."colaboradorGithubBackend" AS "Colab. Backend",
                    s."colaboradorGithubFrontend" AS "Colab. Frontend",
                    s."ramaBackend" AS "Rama Backend",
                    s."ramaFrontend" AS "Rama Frontend",
                    s.created_at AS "Fecha de Creación",
                    CONCAT(u.nombres, ' ', u.apellidos) AS "Solicitado por",
                    CONCAT(a.nombres, ' ', a.apellidos) AS "Aprobado por"
                FROM
                    public."Solicitudes" s
                LEFT JOIN
                    public."Usuarios" u ON u.uid_firebase = s.id_user
                LEFT JOIN
                    public."Usuarios" a ON a.uid_firebase = 'iz0H7ScDl4Zoo6bZ3Q2NwUQqjzu2'
                ORDER BY
                    s.created_at DESC;
            `);

            // Función para encontrar commits introducidos por una rama ya mergeada
            const getMergedBranchCommits = async (branch: string, isFrontend: boolean): Promise<number> => {
                const repo = isFrontend ? frontendRepo : backendRepo;

                try {
                    // Buscar los últimos 100 commits en develop
                    const { data: developCommits } = await octokit.repos.listCommits({
                        owner: org,
                        repo,
                        sha: 'develop',
                        per_page: 100
                    });

                    // Buscar merge commit que mencione la rama
                    const mergeCommit = developCommits.find(c =>
                        c.commit.message.includes(`from GestionCursos/${branch}`)
                    );

                    if (!mergeCommit) {
                        console.warn(`No se encontró merge commit para ${branch}`);
                        return 0;
                    }

                    // Obtener el merge commit completo (para acceder a sus padres)
                    const { data: fullMerge } = await octokit.repos.getCommit({
                        owner: org,
                        repo,
                        ref: mergeCommit.sha
                    });

                    // Asegurar que haya dos padres (merge real)
                    if (fullMerge.parents.length < 2) {
                        console.warn(`Merge commit para ${branch} no tiene dos padres`);
                        return 0;
                    }

                    const parentDevelop = fullMerge.parents[0].sha;
                    const parentBranch = fullMerge.parents[1].sha;

                    // Comparar commits introducidos por la rama en el merge
                    const { data: comparison } = await octokit.repos.compareCommits({
                        owner: org,
                        repo,
                        base: parentDevelop,
                        head: mergeCommit.sha
                    });

                    return comparison.commits.length;
                } catch (error) {
                    console.error(`Error obteniendo commits de rama mergeada (${branch}):`, error.message);
                    return 0;
                }
            };

            const solicitudesConEstadisticas = await Promise.all(solicitudes.map(async s => {
                const branchStats = {
                    backendCommits: 0,
                    frontendCommits: 0
                };

                if (s["Rama Backend"]) {
                    branchStats.backendCommits = await getMergedBranchCommits(s["Rama Backend"], false);
                }

                if (s["Rama Frontend"]) {
                    branchStats.frontendCommits = await getMergedBranchCommits(s["Rama Frontend"], true);
                }

                return {
                    ...s,
                    ...branchStats
                };
            }));

            return solicitudesConEstadisticas;
        } catch (error) {
            return {
                error: 'No se pudieron obtener los datos para la auditoría',
                details: error.message
            };
        }
    }

}
