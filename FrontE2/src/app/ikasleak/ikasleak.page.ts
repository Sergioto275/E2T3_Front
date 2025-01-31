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
  taldeak: Taldea[]=[];
  gruposDisponibles: Taldea[] = [];
  selectedAlumno: Ikaslea = { id: 0, izena: '', abizenak: '', taldea: { kodea: ''}};
  isEditModalOpen: boolean = false;
  nuevoAlumno: Ikaslea = { id: 0, izena: '', abizenak: '', taldea: { kodea: ''}};
  nuevoGrupo: Taldea = { kodea: '', izena: '' };
  kodeak: Taldea[] = [];

  constructor(
    private modalController: ModalController,
    private ikasleService: IkasleZerbitzuakService
  ) {}

  ngOnInit() {
    
    this.getGrupos();
    // Obtener alumnos
    this.getAlumnos();
  }


  
  // Método para obtener los alumnos de la API
  getAlumnos() {
    this.ikasleService.getAlumnos().subscribe((data: Ikaslea[]) => {
      
      this.ikasleak = data.filter((ikaslea) => !ikaslea.ezabatzeData);  // Asignar los alumnos a la propiedad ikasleak
      this.filteredAlumnos = [...this.ikasleak]; // Inicializar la lista filtrada con todos los alumnos
    });
  }

  getGrupos(){
    this.ikasleService.getGrupos().subscribe((data: Taldea[]) => {
      this.taldeak = data.filter((grupo) => !grupo.ezabatzeData);  // Cargar los grupos en la variable
      console.log(this.taldeak); // Esto es solo para verificar que se están cargando correctamente
      this.gruposDisponibles = [...this.taldeak]
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
    if (this.selectedAlumno && this.selectedAlumno.taldea.kodea) {
      // Creamos el objeto con los datos actualizados
      let updatedData = {
        "id": this.selectedAlumno.id, // Mantén el ID del alumno
        "izena": this.selectedAlumno.izena, // Nombre
        "abizenak": this.selectedAlumno.abizenak, // Apellidos
        taldea: {
          "kodea": this.selectedAlumno.taldea.kodea, // Código del grupo
          "izena": this.selectedAlumno.taldea.izena // Nombre del grupo (si es necesario)
        }
      };
  
      console.log('Datos actualizados:', updatedData);
  
      // Llamada al servicio para actualizar el alumno
      this.ikasleService.updateAlumno(updatedData).subscribe((updatedAlumno) => {
        // Actualizamos el alumno en la lista de alumnos
        this.ikasleak = this.ikasleak.map((alumno) =>
          alumno.id === updatedAlumno.id ? updatedAlumno : alumno
        );
  
        // Cerramos el modal de edición después de la actualización
        this.closeEditModal();
      }, (error) => {
        console.error('Error al actualizar el alumno:', error);
      });
    } else {
      console.error("No se ha seleccionado un código de grupo o alumno.");
    }
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
        // Eliminar el alumno de la lista
        this.ikasleak = this.ikasleak.filter((alumno) => alumno.id !== id);
        this.filteredAlumnos = [...this.ikasleak];  // Actualizar la lista filtrada
      });
    });
    this.selectedIkasleak.clear();  // Limpiar la selección después de eliminar
  }

  async agregarAlumno() {
    let data = {
      "izena": this.nuevoAlumno.izena,
      "abizenak": this.nuevoAlumno.abizenak,
      taldea: {
        "kodea": this.nuevoAlumno.taldea.kodea
      }
  }
  console.log(data);

    this.ikasleService.agregarAlumno(data).subscribe((data) => {
      this.ikasleak.push(data);
      this.filteredAlumnos = [...this.ikasleak];
      this.modalController.dismiss();
    });
    this.nuevoAlumno = { izena: '', abizenak: '', taldea: { kodea: '', izena: '' }};
  }

  async agregarGrupo() {
    let data = {
      "kodea": this.nuevoGrupo.kodea,
      "izena": this.nuevoGrupo.izena
    }

    this.ikasleService.agregarGrupo(data).subscribe((data) => {
      this.gruposDisponibles.push(data);
      this.modalController.dismiss();
    });
    this.nuevoGrupo = { kodea: '', izena: '' };
  }

  eliminarGrupo(grupoKodea: string) {
    // Llamamos al servicio que gestiona la eliminación de grupos
    this.ikasleService.eliminarGrupo(grupoKodea).subscribe(
      response => {
        // Aquí, actualizas la lista de grupos disponibles después de eliminar
        this.gruposDisponibles = this.gruposDisponibles.filter(grupo => grupo.kodea !== grupoKodea);
        alert('Grupo eliminado exitosamente');
      },
      error => {
        alert('Hubo un error al eliminar el grupo');
        console.error(error);
      }
    );
  }

  getAlumnosPorKodea(kodea: string): Ikaslea[] {
    return this.ikasleak.filter((ikaslea) => ikaslea.taldea.kodea === kodea);
  }

  onAlumnoSelected(alumnoId: number | undefined) {
    if (alumnoId !== undefined) {
      if (this.selectedIkasleak.has(alumnoId)) {
        this.selectedIkasleak.delete(alumnoId);
      } else {
        this.selectedIkasleak.add(alumnoId);
      }
    }
  }
  
}
