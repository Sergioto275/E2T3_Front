import { Injectable } from '@angular/core';

export interface Ikaslea {
  id: number;
  nombre: string;
  kodea: string;
  abizenak: string;
}

export interface Taldea {
  izena: string;
  ikasleak: Ikaslea[];
}

@Injectable({
  providedIn: 'root',
})
export class IkasleZerbitzuakService {
  filteredAlumnos: Ikaslea[] = [];

  selectedAlumno!: number;

  searchQuery: string = '';

  alumnos: Ikaslea[] = [
    {
      id: 1,
      nombre: 'Julio',
      kodea: '3pag2',
      abizenak: 'Lopez',
    },
    {
      id: 2,
      nombre: 'Maria',
      kodea: '3cca2',
      abizenak: 'Fernandez',
    },
    // Otros alumnos...
  ];

  taldeak: Taldea[] = []; // Lista de grupos

  crearTaldea(taldea: Taldea): void {
    this.taldeak.push(taldea);
  }

  constructor() {}

  // Método para generar un nuevo ID
  generarNuevoId(): number {
    if (this.alumnos.length === 0) {
      return 1; // Si no hay alumnos, el primer ID será 1
    }
    const ids = this.alumnos.map((ikasle) => ikasle.id); // Obtener todos los IDs
    const maxId = Math.max(...ids); // Encontrar el ID máximo
    return maxId + 1; // Incrementar en 1
  }

  // Método para agregar un nuevo alumno
  agregarAlumno(nuevoAlumno: Ikaslea): void {
    nuevoAlumno.id = this.generarNuevoId(); // Asignar un ID único
    this.alumnos.push(nuevoAlumno); // Añadir el nuevo alumno al array
  }

  // Método para eliminar un alumno
  ezabatuPertsona(id: number): void {
    const index = this.alumnos.findIndex((ikasle) => ikasle.id === id);
    if (index !== -1) {
      this.alumnos.splice(index, 1); // Eliminar el alumno del array
    } else {
      console.log(`ID ${id} duen pertsona ez da aurkitu`);
    }
  }
}
