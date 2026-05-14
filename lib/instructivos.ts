export interface InstructivoPDF {
  nombre: string;
  archivo: string;
}

export interface CarpetaInstructivos {
  nombre: string;
  slug: string;
  archivos: InstructivoPDF[];
}

export const INSTRUCTIVOS: CarpetaInstructivos[] = [
  {
    nombre: "Accesos",
    slug: "accesos",
    archivos: [
      { nombre: "Aperturas de emergencia (Creación)", archivo: "Instructivo Software INWeb - Aperturas de emergencia (Creacion).pdf" },
      { nombre: "Contratistas", archivo: "Instructivo Software INWeb - Contratistas.pdf" },
      { nombre: "Monitor de Eventos", archivo: "Instructivo Software INWeb - Monitor de Eventos.pdf" },
    ],
  },
  {
    nombre: "Asistencia",
    slug: "asistencia",
    archivos: [
      { nombre: "Asignación de Jornadas", archivo: "Instructivo Software INWeb - Asignacion de Jornadas.pdf" },
      { nombre: "Asignación de Turnos", archivo: "Instructivo Software INWeb - Asignacion de Turnos.pdf" },
      { nombre: "Autorizar Horas", archivo: "Instructivo Software INWeb - Autorizar Horas.pdf" },
      { nombre: "Cargar Justificaciones", archivo: "Instructivo Software INWeb - Cargar Justificaciones.pdf" },
      { nombre: "Compensación de Horas", archivo: "Instructivo Software INWeb - Compensación de Horas.pdf" },
      { nombre: "Correcciones Masivas", archivo: "Instructivo Software INWeb - Correcciones Masivas.pdf" },
      { nombre: "Creación de Calendarios de Feriados y Asignación", archivo: "Instructivo Software INWeb - Creación de Calendarios de Feriados y Asignacion.pdf" },
      { nombre: "Creación de Conceptos y Perfiles", archivo: "Instructivo Software INWeb - Creación de Conceptos y Perfiles.pdf" },
      { nombre: "Creación de Jornadas", archivo: "Instructivo Software INWeb - Creación de Jornadas.pdf" },
      { nombre: "Estado de Asistencia Grupal", archivo: "Instructivo Software INWeb - Estado de Asistencia Grupal.pdf" },
      { nombre: "Estado de Asistencia Individual", archivo: "Instructivo Software INWeb - Estado de Asistencia Individual.pdf" },
      { nombre: "Grupos de Autorizadores", archivo: "Instructivo Software INWeb - Grupos de Autorizadores.pdf" },
      { nombre: "Marcaciones (Asistencia)", archivo: "Instructivo Software INWeb - Marcaciones (Asistencia).pdf" },
      { nombre: "Procesar Marcaciones", archivo: "Instructivo Software INWeb - Procesar marcaciones.pdf" },
      { nombre: "Resumen de Asistencia", archivo: "Instructivo Software INWeb - Resumen de Asistencia.pdf" },
      { nombre: "Saldo de Cuentas Corrientes", archivo: "Instructivo Software INWeb - Saldo de Cuentas Corrientes.pdf" },
    ],
  },
  {
    nombre: "Controladores",
    slug: "controladores",
    archivos: [
      { nombre: "Aperturas de emergencia", archivo: "Instructivo Software INWeb - Aperturas de emergencia (Controladores).pdf" },
      { nombre: "Asignación de accesos por lector", archivo: "Instructivo Software INWeb - Asignacion de accesos por lector (Controladores).pdf" },
      { nombre: "Asignación de Accesos", archivo: "Instructivo Software INWeb - Asignación de Accesos (Controladores).pdf" },
      { nombre: "Consulta de asignaciones de accesos", archivo: "Instructivo Software INWeb - Consulta de asignaciones de accesos (Controladores).pdf" },
      { nombre: "Controladores", archivo: "Instructivo Software INWeb - Controladores.pdf" },
      { nombre: "Exportación e Importación de Marcaciones", archivo: "Instructivo Software INWeb - Exportacion e Importacion de Marcaciones (Controladores).pdf" },
      { nombre: "Formatos de marcaciones", archivo: "Instructivo Software INWeb - Formatos de marcaciones (Controladores).pdf" },
      { nombre: "Grupos de controladores", archivo: "Instructivo Software INWeb - Grupos de controladores (Controladores).pdf" },
      { nombre: "Panel de Control", archivo: "Instructivo Software INWeb - Panel de Control (Controladores).pdf" },
      { nombre: "Perfiles de Acceso", archivo: "Instructivo Software INWeb - Perfiles de Acceso (Controladores).pdf" },
    ],
  },
  {
    nombre: "Empleados",
    slug: "empleados",
    archivos: [
      { nombre: "Creación de Empleado", archivo: "Instructivo Software INWeb - Creación de Empleado.pdf" },
      { nombre: "Editar Empleados", archivo: "Instructivo Software INWeb - Editar Empleados.pdf" },
    ],
  },
  {
    nombre: "Reportes",
    slug: "reportes",
    archivos: [
      { nombre: "Reportes", archivo: "Instructivo Software INWeb - Reportes.pdf" },
    ],
  },
  {
    nombre: "Seguridad",
    slug: "seguridad",
    archivos: [
      { nombre: "Asignación de Roles y Permisos a Usuarios", archivo: "Instructivo Software INWeb - Asignacion de Roles y Permisos a Usuarios.pdf" },
      { nombre: "Usuarios del Sistema", archivo: "Instructivo Software INWeb - Usuarios del Sistema.pdf" },
    ],
  },
  {
    nombre: "Tareas",
    slug: "tareas",
    archivos: [
      { nombre: "Tareas", archivo: "Instructivo Software INWeb - Tareas.pdf" },
    ],
  },
  {
    nombre: "Visitas",
    slug: "visitas",
    archivos: [
      { nombre: "Identificaciones", archivo: "Instructivo Software INWeb - Identificaciones (Visitas).pdf" },
      { nombre: "Precarga de Visitas", archivo: "Instructivo Software INWeb - Pregarga de Visitas.pdf" },
      { nombre: "Tipos de Visitas", archivo: "Instructivo Software INWeb - Tipos de Visitas.pdf" },
      { nombre: "Unidades Funcionales", archivo: "Instructivo Software INWeb - Unidades Funcionales (Visitas).pdf" },
      { nombre: "Vehículos", archivo: "Instructivo Software INWeb - Vehiculos (Visitas).pdf" },
      { nombre: "Visitas", archivo: "Instructivo Software INWeb - Visitas.pdf" },
    ],
  },
];
