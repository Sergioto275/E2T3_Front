import { Ikaslea, IkasleZerbitzuakService, Taldea } from './../zerbitzuak/ikasle-zerbitzuak.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ikasleak',
  templateUrl: './ikasleak.page.html',
  styleUrls: ['./ikasleak.page.scss'],
  standalone: false,
})
export class IkasleakPage implements OnInit {
  selectedIkasleak: Set<number> = new Set(); // IDs de los alumnos seleccionados para el grupo
  taldeIzena: string = ''; // Nombre del nuevo grupo
  ikasleak: Ikaslea[] = []; // Lista de alumnos
  filteredAlumnos: Ikaslea[] = []; // Lista filtrada para la búsqueda
  searchQuery: string = ''; // Texto de búsqueda
  gruposDisponibles: string[] = []; // Lista de grupos disponibles


  nuevoAlumno: Ikaslea = {
    id: 0,
    nombre: '',
    abizenak: '',
    kodea: '',
    taldea: '', // Grupo asignado
  };

  constructor(
    private modalController: ModalController,
    private ikasleService: IkasleZerbitzuakService
  ) {}

  ngOnInit() {
    this.ikasleak = this.ikasleService.ikasleak; // Cargar los alumnos del servicio
    this.filteredAlumnos = [...this.ikasleak]; // Inicializar la lista filtrada
    this.gruposDisponibles = this.ikasleService.grupos; // Obtener los grupos disponibles
  }

  onIkasleSelected(id: number) {
    if (this.selectedIkasleak.has(id)) {
      this.selectedIkasleak.delete(id);
    } else {
      this.selectedIkasleak.add(id);
    }
  }

  sortuTaldea() {
    const taldea: Taldea = {
      izena: this.taldeIzena,
      ikasleak: this.ikasleak.filter((ikaslea) =>
        this.selectedIkasleak.has(ikaslea.id)
      ),
    };

    this.ikasleService.crearTaldea(taldea);

    // Limpiar los datos después de crear el grupo
    this.taldeIzena = '';
    this.selectedIkasleak.clear();
  }

  filterAlumnos() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAlumnos = query
      ? this.ikasleak.filter((ikaslea) =>
          `${ikaslea.nombre} ${ikaslea.abizenak} ${ikaslea.kodea}`
            .toLowerCase()
            .includes(query)
        )
      : [...this.ikasleak];
  }

  onAlumnoSelected(id: number) {
    if (this.selectedIkasleak.has(id)) {
      this.selectedIkasleak.delete(id);
    } else {
      this.selectedIkasleak.add(id);
    }
  }

  eliminarAlumnos() {
    this.selectedIkasleak.forEach((id) => this.ikasleService.ezabatuPertsona(id));
    this.ikasleak = this.ikasleService.ikasleak; // Actualizar la lista de alumnos después de eliminar
    this.filteredAlumnos = [...this.ikasleak];
    this.selectedIkasleak.clear();
    this.modalController.dismiss(); // Cerrar el modal
  }

  async agregarAlumno() {
    this.ikasleService.agregarAlumno(this.nuevoAlumno);
    this.ikasleak = this.ikasleService.ikasleak; // Actualizar la lista de alumnos
    this.filteredAlumnos = [...this.ikasleak]; // Actualizar la lista filtrada

    // Limpiar los datos del formulario
    this.nuevoAlumno = {
      id: 0,
      nombre: '',
      abizenak: '',
      kodea: '',
      taldea: '',
    };

    this.modalController.dismiss(); // Cerrar el modal
  }
}
