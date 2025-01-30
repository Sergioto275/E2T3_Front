import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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
  selectedTalde: Taldea = { kodea: '', izena: '' };
  isEditTaldeModalOpen: boolean = false;
  fecha: string = '';
  horaInicio: string = '';
  horaFin: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  grupoSeleccionado: Taldea = { kodea: '', izena: '' };
  diaSeleccionado: number = 0;


  constructor(
    private modalController: ModalController,
    private ikasleService: IkasleZerbitzuakService,
    private alertController: AlertController
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

  async getGrupos(){
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
  

  filterAlumnos() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAlumnos = query
      ? this.ikasleak.filter(
          (ikaslea) =>
            `${ikaslea.izena} ${ikaslea.abizenak} ${ikaslea.taldea.kodea} ${ikaslea.taldea.izena}`.toLowerCase().includes(query)
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
    this.getGrupos();
  }

// Abre el modal para editar un talde
openEditTaldeModal(talde: Taldea) {
  this.selectedTalde = { ...talde };  // Clonar el objeto seleccionado
  console.log('selectedTalde al abrir modal:', this.selectedTalde);
  this.isEditTaldeModalOpen = true;
}



// Cierra el modal de edición
closeEditTaldeModal() {
  this.isEditTaldeModalOpen = false;
}

  updateTalde() {
    const updatedTalde = {
      kodea: this.selectedTalde.kodea,
      izena: this.selectedTalde.izena
    };

    this.ikasleService.updateGrupo(updatedTalde).subscribe(() => {
      const index = this.taldeak.findIndex(
        (grupo) => grupo.kodea === updatedTalde.kodea
      );
      if (index !== -1) {
        this.taldeak[index] = updatedTalde;
      }
      this.gruposDisponibles = [...this.taldeak];
      this.closeEditTaldeModal();
    });
  }
  

  
  

  updateAlumno() {
    const updatedAlumno = {
      id: this.selectedAlumno.id,
      izena: this.selectedAlumno.izena,
      abizenak: this.selectedAlumno.abizenak,
      taldea: { ...this.selectedAlumno.taldea }
    };

    this.ikasleService.updateAlumno(updatedAlumno).subscribe(() => {
      const index = this.ikasleak.findIndex(
        (alumno) => alumno.id === updatedAlumno.id
      );
      if (index !== -1) {
        this.ikasleak[index] = updatedAlumno;
      }
      this.filteredAlumnos = [...this.ikasleak];
      this.closeEditModal();
    });
  }

  async confirmarEliminacionGrupo(grupoKodea: string) {
    const alert = await this.alertController.create({
      header: 'Segurtasuna',
      message: 'Ziur al zaude talde hau ezabatu nahi duzula?',
      buttons: [
        {
          text: 'Ezeztatu',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Ezeztatu');
          }
        },
        {
          text: 'Ezabatu',
          handler: () => {
            this.eliminarGrupo(grupoKodea);
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  eliminarGrupo(grupoKodea: string) {
    // Llamamos al servicio que gestiona la eliminación de grupos
    this.ikasleService.eliminarGrupo(grupoKodea).subscribe(
      response => {
        // Aquí, actualizas la lista de grupos disponibles después de eliminar
        this.gruposDisponibles = this.gruposDisponibles.filter(grupo => grupo.kodea !== grupoKodea);
        alert('Taldea ezabatuta');
      },
      error => {
        alert('Arazo bat egon da taldea ezabatzerakoan');
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
  
  // Función para guardar los datos del horario
  async guardarHorario() {
    // Verifica si todos los campos necesarios están completos
    if (!this.horaInicio || !this.horaFin || !this.fechaInicio || !this.fechaFin || !this.grupoSeleccionado.kodea || !this.diaSeleccionado) {
      // Si algún campo no está completo, muestra un mensaje de error
      this.showAlert('Error', 'Por favor, rellena todos los campos.');
      return;
    }
  
    const horarioData = {
      taldea: {
        "kodea": this.grupoSeleccionado.kodea,
      },
      "eguna": this.diaSeleccionado,
      "hasieraData": this.fechaInicio,
      "amaieraData": this.fechaFin,
      "hasieraOrdua": this.horaInicio,
      "amaieraOrdua": this.horaFin,
    };
  
    console.log(horarioData);
  
    // Usamos subscribe para manejar la respuesta
    this.ikasleService.guardarHorario(horarioData).subscribe(
      (response) => {
        // Aquí verificamos si el horario se ha guardado correctamente (comprobando el ID o cualquier otra propiedad)
        if (response && response.id) {
          this.showAlert('Éxito', 'Horario guardado correctamente');
        } else {
          this.showAlert('Error', 'Hubo un error al guardar el horario');
        }
      },
      (error) => {
        console.error('Error al guardar el horario:', error);
        this.showAlert('Error', 'Hubo un problema con la conexión');
      }
    );
  }
  
  
  

  // Mostrar alerta en caso de éxito o error
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Función para cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }

}
