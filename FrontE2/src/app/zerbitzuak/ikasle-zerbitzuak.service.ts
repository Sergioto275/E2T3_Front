import { Injectable } from '@angular/core';

export interface Ikaslea {
  id: number;
  nombre: string;
  kodea: string;
  abizenak: string;
  taldea?:string;
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

  ikasleak: Ikaslea[] = [
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

  get alumnos() {
    return this.ikasleak;
  }

  get grupos() {
    return this.taldeak.map((talde) => talde.izena);
  }

  crearTaldea(taldea: Taldea): void { 
    this.taldeak.push(taldea);
  }

  agregarAlumno(nuevoAlumno: Ikaslea) {
    const id = this.ikasleak.length > 0 ? this.ikasleak[this.ikasleak.length - 1].id + 1 : 1;
    this.ikasleak.push({ ...nuevoAlumno, id });
  }

  constructor() {}

  // Método para generar un nuevo ID
  generarNuevoId(): number {
    if (this.ikasleak.length === 0) {
      return 1; // Si no hay alumnos, el primer ID será 1
    }
    const ids = this.ikasleak.map((ikasle) => ikasle.id); // Obtener todos los IDs
    const maxId = Math.max(...ids); // Encontrar el ID máximo
    return maxId + 1; // Incrementar en 1
  }

  ezabatuPertsona(id: number) {
    this.ikasleak = this.ikasleak.filter((ikaslea) => ikaslea.id !== id);
  }
}
