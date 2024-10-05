import { Persona } from "./persona.model";

export interface Tarea {
    id: number;
    nombre: string;
    fechaLimite: Date;
    completada: boolean;
    personas: Persona[];
  }