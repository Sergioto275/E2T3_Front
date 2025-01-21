import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IkasleZerbitzuakService, Ikaslea, Taldea } from './../zerbitzuak/ikasle-zerbitzuak.service';

@Component({
  selector: 'app-ikasleak',
  templateUrl: './ikasleak.page.html',
  styleUrls: ['./ikasleak.page.scss'],
})
export class IkasleakPage implements OnInit {
  selectedIkasleak: Set<number> = new Set();
  searchQuery: string = '';
  ikasleak: Ikaslea[] = [];
  filteredAlumnos: Ikaslea[] = [];
  gruposDisponibles: Taldea[] = [];
  selectedAlumno: Ikaslea = { id: 0, izena: '', abizenak: '', taldea: { kodea: '', izena: '', eguneratzeData: '',sortzeData: '', ezabatzeData: null } , eguneratzeData: '', ezabatzeData: null, mugimenduak: [], sortzeData: '' };
  isEditModalOpen: boolean = false;
  nuevoAlumno: Ikaslea = { id: 0, izena: '', abizenak: '', taldea: { kodea: '', izena: '' }, eguneratzeData: '', ezabatzeData: null, mugimenduak: [], sortzeData: '' };
  nuevoGrupo: Taldea = { kodea: '', izena: '' };
  kodeak: Taldea[] = [];

  constructor(
    private modalController: ModalController,
    private ikasleService: IkasleZerbitzuakService
  ) {}

  ngOnInit() {
    // Obtener grupos
    this.ikasleService.getGrupos().subscribe((data) => {
      this.gruposDisponibles = data;
    });

    // Obtener alumnos
    this.getAlumnos();
  }

  // Método para obtener los alumnos de la API
  getAlumnos() {
    this.ikasleService.getAlumnos().subscribe((data: Ikaslea[]) => {
      this.ikasleak = data; // Asignar los alumnos a la propiedad ikasleak
      this.filteredAlumnos = [...this.ikasleak]; // Inicializar la lista filtrada con todos los alumnos
    });
  }

  openEditModal(ikaslea: Ikaslea) {
    this.selectedAlumno = { ...ikaslea };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  updateAlumno() {
    this.ikasleService.updateAlumno(this.selectedAlumno).subscribe((updatedAlumno) => {
      this.ikasleak = this.ikasleak.map((alumno) =>
        alumno.id === updatedAlumno.id ? updatedAlumno : alumno
      );
      this.closeEditModal();
    });
  }

  filterAlumnos() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAlumnos = query
      ? this.ikasleak.filter(
          (ikaslea) =>
            `${ikaslea.izena} ${ikaslea.abizenak} ${ikaslea.taldea.kodea}`.toLowerCase().includes(query)
        )
      : [...this.ikasleak];
  }

  eliminarAlumnos() {
    this.selectedIkasleak.forEach((id) => {
      this.ikasleService.eliminarAlumno(id).subscribe(() => {
        this.ikasleak = this.ikasleak.filter((alumno) => alumno.id !== id);
        this.filteredAlumnos = [...this.ikasleak];
      });
    });
    this.selectedIkasleak.clear();
  }

  async agregarAlumno() {
    this.ikasleService.agregarAlumno(this.nuevoAlumno).subscribe((nuevoAlumno) => {
      this.ikasleak.push(nuevoAlumno);
      this.filteredAlumnos = [...this.ikasleak];
      this.modalController.dismiss();
    });
    this.nuevoAlumno = { izena: '', abizenak: '', taldea: { kodea: '', izena: '' }, mugimenduak: [] };
  }

  async agregarGrupo() {
    this.ikasleService.agregarGrupo(this.nuevoGrupo).subscribe((nuevoGrupo) => {
      this.gruposDisponibles.push(nuevoGrupo);
      this.modalController.dismiss();
    });
    this.nuevoGrupo = { kodea: '', izena: '' };
  }

  getAlumnosPorKodea(kodea: string): Ikaslea[] {
    return this.ikasleak.filter((ikaslea) => ikaslea.taldea.kodea === kodea);
  }

  onAlumnoSelected(alumnoId: number) {
    if (this.selectedIkasleak.has(alumnoId)) {
      this.selectedIkasleak.delete(alumnoId); // Eliminar de la selección
    } else {
      this.selectedIkasleak.add(alumnoId); // Añadir a la selección
    }
  }
}
