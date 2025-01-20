import { Injectable } from '@angular/core';

export interface Ikaslea {
  id: number;
  nombre: string;
  abizenak: string;
  kodea: Kodea;
}


export interface Kodea {
  kodea: string;
  izena?: string;
}

@Injectable({
  providedIn: 'root',
})
export class IkasleZerbitzuakService {
  filteredAlumnos: Ikaslea[] = [];

  selectedAlumno!: number;

  searchQuery: string = '';

  kodeak: Kodea[] = [
    {
      kodea: '3pag2',
      izena: '2undo de Desarrollo de aplicaciones multiplataforma',
    },
    {
      kodea: '3pag1',
      izena: '1ero de Desarrollo de aplicaciones multiplataforma',
    },
    {
      kodea: '2cca1',
      izena: 'Cosas raras de primero',
    },
  ]

  ikasleak: Ikaslea[] = [
    {
      id: 1,
      nombre: 'Julio',
      kodea: this.kodeak.find(k => k.kodea === '3pag2') || { kodea: '', izena: '' },
      abizenak: 'Lopez',
    },
    {
      id: 2,
      nombre: 'Maria',
      kodea: this.kodeak.find(k => k.kodea === '3pag1') || { kodea: '', izena: '' },
      abizenak: 'Fernandez',
    },
  ];
  


  get alumnos() {
    return this.ikasleak;
  }

  get grupos() {
    return this.kodeak.map((talde) => talde.izena);
  }

  crearKodea(kodea: Kodea): void {
  this.kodeak.push(kodea); 
}

  agregarAlumno(nuevoAlumno: Ikaslea) {
    const id = this.ikasleak.length > 0 ? this.ikasleak[this.ikasleak.length - 1].id + 1 : 1;
    this.ikasleak.push({ ...nuevoAlumno, id });
  }

  agregarKodea(nuevoKode: Kodea) {
    const id = this.kodeak.length > 0 ? this.kodeak[this.kodeak.length - 1].kodea + 1 : 1;
    this.kodeak.push({ ...nuevoKode });
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

  // En ikasle-zerbitzuak.service.ts

updateAlumno(updatedAlumno: Ikaslea) {
  const index = this.ikasleak.findIndex((alumno) => alumno.id === updatedAlumno.id);
  if (index !== -1) {
    this.ikasleak[index] = updatedAlumno; // Actualiza el alumno en la lista
  }
}

}
