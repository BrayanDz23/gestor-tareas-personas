import { Component } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-listado-tareas',
  templateUrl: './listado-tareas.component.html',
  styleUrls: ['./listado-tareas.component.scss'],
})
export class ListadoTareasComponent {
  tareas: Tarea[] = [];
  filtroSeleccionado: string = 'todas';

  constructor(private tareaService: TareaService) {
    this.tareas = this.tareaService.getTareas();
  }

  editarTarea(tarea: Tarea): void {
    this.tareaService.tareaParaEditar.next(tarea);
  }

  marcarComoCompletada(id: number): void {
    this.tareaService.marcarComoCompletada(id);
    this.tareas = this.tareaService.getTareas();
  }

  eliminarTarea(id: number): void {
    this.tareaService.eliminarTarea(id);
    this.tareas = this.tareaService.getTareas();
  }

  filtrarTareas(filtro: string): void {
    this.filtroSeleccionado = filtro;
    if (filtro === 'completadas') {
      this.tareas = this.tareaService.getTareas().filter(t => t.completada);
    } else if (filtro === 'pendientes') {
      this.tareas = this.tareaService.getTareas().filter(t => !t.completada);
    } else {
      this.tareas = this.tareaService.getTareas();
    }
  }
}
