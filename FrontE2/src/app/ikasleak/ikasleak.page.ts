import {
  Ikaslea,
  IkasleZerbitzuakService,
  Kodea,
} from './../zerbitzuak/ikasle-zerbitzuak.service';
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
  gruposDisponibles: Kodea[] = []; // Lista de grupos disponibles
  selectedAlumno: Ikaslea = {
    id: 0,
    nombre: '',
    abizenak: '',
    kodea: {
      izena: '',
      kodea: ''
    },
  };
  isEditModalOpen: boolean = false; // Añadir esta propiedad
  kodeak: Kodea[] = [];

  nuevoAlumno: Ikaslea = {
    id: 0,
    nombre: '',
    abizenak: '',
    kodea: {
      izena: '',
      kodea: ''
    },
  };
  nuevoKode: Kodea = {
    kodea: '',
    izena: '',
  };
  

  constructor(
    private modalController: ModalController,
    private ikasleService: IkasleZerbitzuakService
  ) {}

  ngOnInit() {
    this.ikasleak = this.ikasleService.ikasleak;
    this.filteredAlumnos = [...this.ikasleak];
    this.gruposDisponibles = this.ikasleService.kodeak;
    this.kodeak = this.ikasleService.kodeak; // Asegúrate de cargar los códigos aquí
  }

  openEditModal(ikaslea: Ikaslea) {
    // Asegurar que las propiedades anidadas existan antes de abrir el modal
    this.selectedAlumno = {
      ...ikaslea,
      kodea: {
        izena: ikaslea.kodea?.izena || '',
        kodea: ''
      },
    };
    this.isEditModalOpen = true; // Abre el modal
  }
  

  closeEditModal() {
    this.isEditModalOpen = false; // Cerrar el modal
  }

  updateAlumno() {
    console.log('Alumno actualizado:', this.selectedAlumno);
  
    // Actualizar el alumno en el servicio
    this.ikasleService.updateAlumno(this.selectedAlumno);
  
    // Cerrar el modal después de la actualización
    this.closeEditModal();
    
    // Actualizar la lista de alumnos
    this.ikasleak = this.ikasleService.ikasleak;
    this.filteredAlumnos = [...this.ikasleak];
  }
  

  onIkasleSelected(id: number) {
    if (this.selectedIkasleak.has(id)) {
      this.selectedIkasleak.delete(id);
    } else {
      this.selectedIkasleak.add(id);
    }
  }

  

  filterAlumnos() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAlumnos = query
      ? this.ikasleak.filter((ikaslea) =>
          `${ikaslea.nombre} ${ikaslea.abizenak} ${ikaslea.kodea.izena}`
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
    this.selectedIkasleak.forEach((id) =>
      this.ikasleService.ezabatuPertsona(id)
    );
    this.ikasleak = this.ikasleService.ikasleak; // Actualizar la lista de alumnos después de eliminar
    this.filteredAlumnos = [...this.ikasleak];
    this.selectedIkasleak.clear();
    this.modalController.dismiss(); // Cerrar el modal
  }

  async agregarKodea() {
    // Add the new student to the service
    this.ikasleService.agregarKodea(this.nuevoKode);
    
    // Optionally, refresh the student list
    this.modalController.dismiss(); // Close the modal
    console.log('Nuevo Kode creado:', this.nuevoAlumno);

    // Clear the form
    this.nuevoKode = {
      kodea: '',
      izena: '',
    };

    this.ngOnInit();
  
}

  async agregarAlumno() {
      // Add the new student to the service
      this.ikasleService.agregarAlumno(this.nuevoAlumno);
      
      // Optionally, refresh the student list
      this.modalController.dismiss(); // Close the modal
      console.log('Nuevo alumno creado:', this.nuevoAlumno);

      // Clear the form
      this.nuevoAlumno = {
        id: 0,
        nombre: '',
        abizenak: '',
        kodea: {
          izena: '',
          kodea: ''
        },
      };

      this.ngOnInit();
    
  }

  getAlumnosPorKodea(kodea: string): Ikaslea[] {
    return this.ikasleak.filter((ikaslea) => ikaslea.kodea.kodea === kodea);
  }
}
