import {
  Ikaslea,
  IkasleZerbitzuakService,
  Kodea,
  Taldea,
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
  gruposDisponibles: string[] = []; // Lista de grupos disponibles
  selectedAlumno: Ikaslea | null = null;
  isEditModalOpen: boolean = false; // Añadir esta propiedad
  kodeak: Kodea[] = [];

  nuevoAlumno: Ikaslea = {
    id: 0,
    nombre: '',
    abizenak: '',
    kodea: { izena: '' },
    taldea: { izena: '' }, // Inicializa taldea
  };
  

  constructor(
    private modalController: ModalController,
    private ikasleService: IkasleZerbitzuakService
  ) {}

  ngOnInit() {
    this.ikasleak = this.ikasleService.ikasleak;
    this.filteredAlumnos = [...this.ikasleak];
    this.gruposDisponibles = this.ikasleService.grupos;
    this.kodeak = this.ikasleService.kodeak; // Asegúrate de cargar los códigos aquí
  }

  openEditModal(ikaslea: Ikaslea) {
    this.selectedAlumno = { ...ikaslea }; // Copia los datos del alumno
    console.log(this.selectedAlumno);
    this.isEditModalOpen = true; // Abre el modal
  }

  closeEditModal() {
    this.isEditModalOpen = false; // Cerrar el modal
  }

  updateAlumno() {
    if (this.selectedAlumno) {
      const index = this.ikasleService.ikasleak.findIndex(
        (ikasle) => ikasle.id === this.selectedAlumno!.id
      );
      if (index !== -1) {
        // Si hay un grupo seleccionado, actualiza el grupo del alumno
        if (this.selectedAlumno.taldea && this.selectedAlumno.taldea.izena) {
          this.ikasleService.ikasleak[index] = { ...this.selectedAlumno };
        }
      }
      this.closeEditModal(); // Cerrar el modal después de guardar
    }
  }

  onIkasleSelected(id: number) {
    if (this.selectedIkasleak.has(id)) {
      this.selectedIkasleak.delete(id);
    } else {
      this.selectedIkasleak.add(id);
    }
  }

  sortuTaldea() {
    if (!this.taldeIzena) {
      alert('Debes ingresar el nombre del grupo.');
      return;
    }

    const taldea: Taldea = {
      izena: this.taldeIzena,
      ikasleak: this.ikasleak.filter((ikaslea) =>
        this.selectedIkasleak.has(ikaslea.id)
      ),
    };

    // Asegúrate de que 'ikasleak' existe antes de hacer forEach
    if (taldea.ikasleak && Array.isArray(taldea.ikasleak)) {
      taldea.ikasleak.forEach((ikaslea) => {
        ikaslea.taldea = taldea; // Asignar el grupo completo al alumno
      });
    }

    // Llamar al servicio para crear el grupo
    this.ikasleService.crearTaldea(taldea);

    // Limpiar los datos
    this.taldeIzena = '';
    this.selectedIkasleak.clear();
    this.gruposDisponibles = this.ikasleService.grupos; // Actualizar la lista de grupos
    this.modalController.dismiss();
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
    this.selectedIkasleak.forEach((id) =>
      this.ikasleService.ezabatuPertsona(id)
    );
    this.ikasleak = this.ikasleService.ikasleak; // Actualizar la lista de alumnos después de eliminar
    this.filteredAlumnos = [...this.ikasleak];
    this.selectedIkasleak.clear();
    this.modalController.dismiss(); // Cerrar el modal
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
        kodea: { izena: '' },
        taldea: { izena: '' },
      };
    
  }
}
