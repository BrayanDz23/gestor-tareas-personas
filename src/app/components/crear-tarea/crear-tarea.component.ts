import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.scss'],
})
export class CrearTareaComponent implements OnInit {
  tareaForm: FormGroup;

  constructor(private fb: FormBuilder, private tareaService: TareaService) {
    this.tareaForm = this.fb.group({
      id: [0],
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      fechaLimite: ['', Validators.required],
      personas: this.fb.array([], this.validarNombresDuplicados()),
    });
  }

  ngOnInit(): void {
    this.tareaService.tareaParaEditar.subscribe(tarea => {
      if (tarea) {
        this.tareaForm.patchValue({
          id: tarea.id,
          nombre: tarea.nombre,
          fechaLimite: tarea.fechaLimite,
        });
        this.tareaForm.setControl('personas', this.fb.array(tarea.personas.map(persona => this.crearPersonaFormGroup(persona)), this.validarNombresDuplicados()));
      }
    });
  }

  get personas(): FormArray {
    return this.tareaForm.get('personas') as FormArray;
  }

  crearPersonaFormGroup(persona?: { nombre: string; edad: number; habilidades: string[] }): FormGroup {
    return this.fb.group({
      nombre: [persona ? persona.nombre : '', [Validators.required, Validators.minLength(5)]],
      edad: [persona ? persona.edad : '', [Validators.required, Validators.min(18)]],
      habilidades: this.fb.array(persona ? persona.habilidades.map(h => this.fb.control(h)) : [this.fb.control('', Validators.required)]),
    });
  }

  agregarPersona(): void {
    this.personas.push(this.crearPersonaFormGroup());
    this.personas.updateValueAndValidity();
  }

  eliminarPersona(index: number): void {
    this.personas.removeAt(index);
    this.personas.updateValueAndValidity();
  }

  agregarHabilidad(index: number): void {
    const habilidades = this.personas.at(index).get('habilidades') as FormArray;
    habilidades.push(this.fb.control('', Validators.required));
  }

  eliminarHabilidad(personaIndex: number, habilidadIndex: number): void {
    (this.personas.at(personaIndex).get('habilidades') as FormArray).removeAt(habilidadIndex);
  }

  validarNombresDuplicados() {
    return (formArray: FormArray) => {
      const nombres = formArray.controls.map(control => control.get('nombre')?.value?.toLowerCase());
      const nombresUnicos = new Set(nombres);

      if (nombresUnicos.size !== nombres.length) {
        return { nombresDuplicados: true };
      }

      return null;
    };
  }

  guardarTarea(): void {
    if (this.tareaForm.invalid) {
      this.marcarTodosComoTocados(this.tareaForm);
      return;
    }

    const tarea: Tarea = {
      id: this.tareaForm.value.id,
      nombre: this.tareaForm.value.nombre,
      fechaLimite: this.tareaForm.value.fechaLimite,
      personas: this.tareaForm.value.personas,
      completada: false,
    };

    if (tarea.id) {
      this.tareaService.updateTarea(tarea);
    } else {
      this.tareaService.addTarea(tarea);
    }

    this.tareaForm.reset();
  }

  marcarTodosComoTocados(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.marcarTodosComoTocados(control);
      }
    });
  }
}
