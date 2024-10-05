import { Injectable } from '@angular/core';
import { Tarea } from '../models/tarea.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private tareas: Tarea[] = [];
  tareaParaEditar: BehaviorSubject<Tarea | null> = new BehaviorSubject(null);
  private idCounter = 1;

  getTareas(): Tarea[] {
    return this.tareas;
  }

  addTarea(tarea: Tarea): void {
    tarea.id = this.idCounter++;
    this.tareas.push(tarea);
  }

  updateTarea(tareaActualizada: Tarea): void {
    const index = this.tareas.findIndex(t => t.id === tareaActualizada.id);
    if (index !== -1) {
      this.tareas[index] = tareaActualizada;
    }
  }

  marcarComoCompletada(id: number): void {
    const tarea = this.tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
    }
  }

  eliminarTarea(id: number): void {
    this.tareas = this.tareas.filter(tarea => tarea.id !== id);
  }

  getTarea(id: number): Tarea | undefined {
    return this.tareas.find(t => t.id === id);
  }
}
