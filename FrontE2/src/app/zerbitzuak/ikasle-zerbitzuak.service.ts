import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ikaslea {
  id?: number;
  izena: string;
  abizenak: string;
  taldea: Taldea;
  sortzeData?: string;
  eguneratzeData?: string;
  ezabatzeData?: null;
  selected?: boolean;  // Nueva propiedad para controlar la selección
}

export interface Taldea {
  kodea: string;
  izena?: string;
  sortzeData?: string;
  eguneratzeData?: string;
  ezabatzeData?: null;
}

@Injectable({
  providedIn: 'root',
})
export class IkasleZerbitzuakService {

  // Constructor con HttpClient
  constructor(private http: HttpClient) {}

  // Obtener todos los alumnos
  getAlumnos(): Observable<Ikaslea[]> {
    return this.http.get<Ikaslea[]>('http://localhost:8080/api/langileak');
  }

  // Obtener todos los grupos
  getGrupos(): Observable<Taldea[]> {
    return this.http.get<Taldea[]>('http://localhost:8080/api/taldeak');
  }

  // Crear un nuevo alumno
  agregarAlumno(nuevoAlumno: Ikaslea): Observable<Ikaslea> {
    console.log(nuevoAlumno);
     return this.http.post<Ikaslea>('http://localhost:8080/api/langileak', nuevoAlumno);
  }

  // Crear un nuevo grupo
  agregarGrupo(nuevoGrupo: Taldea): Observable<Taldea> {
    return this.http.post<Taldea>('http://localhost:8080/api/taldeak', nuevoGrupo);
  }

  // Actualizar un alumno
  updateAlumno(updatedAlumno: Ikaslea): Observable<Ikaslea> {
    return this.http.put<Ikaslea>('http://localhost:8080/api/langileak/' + updatedAlumno.id, updatedAlumno);
  }

  // Eliminar un alumno
  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>('http://localhost:8080/api/langileak/'+id);
  }

  eliminarGrupo(kodea: string): Observable<any> {
    return this.http.delete('http://localhost:8080/api/taldeak/kodea/'+kodea);
  }

  updateGrupo(updatedGrupo: Taldea): Observable<Taldea> {
    return this.http.put<Taldea>('http://localhost:8080/api/taldeak/' + updatedGrupo.kodea, updatedGrupo);
  }
  
}
