import { Ikaslea, IkasleZerbitzuakService } from './../zerbitzuak/ikasle-zerbitzuak.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ikasleak',
  templateUrl: './ikasleak.page.html',
  styleUrls: ['./ikasleak.page.scss'],
  standalone: false,
})
export class IkasleakPage implements OnInit {



  nuevoAlumno: Ikaslea = {
    id: 0, // El ID se asignará automáticamente por el servicio
    nombre: '',
    abizenak: '',
    kodea: '',
  };

ikasleak: Ikaslea[]=[];

filteredAlumnos: Ikaslea[] = [];

selectedAlumnos: Set<number> = new Set(); // Usamos un Set para almacenar los IDs de los alumnos seleccionados

searchQuery: string = '';

  constructor(
    private modalController: ModalController,
    private ikasleService: IkasleZerbitzuakService
  ) {}

  ngOnInit() {
    // Inicializar los alumnos activos (se filtran aquellos que no estén eliminados)
    this.ikasleak = this.ikasleService.alumnos; // Obtener los alumnos directamente desde el servicio
    this.filteredAlumnos = [...this.ikasleak]; // Copia de los alumnos para filtrar según la búsqueda
  }

  filterAlumnos() {
    if (this.searchQuery.trim() === '') {
      // Si no hay texto de búsqueda, mostrar todos los alumnos activos
      this.filteredAlumnos = this.ikasleak;
    } else {
      // Filtrar por nombre, apellidos y código (o cualquier otro criterio)
      this.filteredAlumnos = this.ikasleak.filter((ikaslea) =>
        `${ikaslea.nombre} ${ikaslea.abizenak} ${ikaslea.kodea}`.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
    // Acción cuando se selecciona un alumno
    onAlumnoSelected(id: number) {
      if (this.selectedAlumnos.has(id)) {
        this.selectedAlumnos.delete(id); // Si el alumno ya está seleccionado, lo deseleccionamos
      } else {
        this.selectedAlumnos.add(id); // Si no está seleccionado, lo agregamos
      }
    }

  eliminarAlumnos() {
    this.selectedAlumnos.forEach((id) => {
      this.ikasleService.ezabatuPertsona(id); // Llamamos al servicio para eliminar cada alumno seleccionado
      this.ngOnInit;
    });
    this.modalController.dismiss(); // Cerramos el modal después de la eliminación
  }

  // Método que se llama cuando el alumno es agregado desde el modal
  async agregarAlumno() {
    // Llamamos al servicio para agregar el nuevo alumno
    this.ikasleService.agregarAlumno(this.nuevoAlumno);
  // Obtener la lista actualizada de alumnos del servicio

    this.ikasleak = this.ikasleService.alumnos;

    // Resetear los campos del formulario en el modal
    this.nuevoAlumno = {
      id: 0,
      nombre: '',
      abizenak: '',
      kodea: '',
    };

    // Cerrar el modal después de agregar el alumno
    this.modalController.dismiss();
  }
}
