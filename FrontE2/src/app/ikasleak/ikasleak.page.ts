import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { IkasleZerbitzuakService, Ikaslea, Taldea, Horario } from './../zerbitzuak/ikasle-zerbitzuak.service';

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
  horaInicio: any = null;
  horaFin: any = null;
  fechaInicio: any = null;
  fechaFin: any = null;

  grupoSeleccionado: Taldea = { kodea: '', izena: '' };
  diaSeleccionado: number = 0;

  ordutegiArray: Horario[] = [];
  ordutegia: Horario = {
    taldea: {
    kodea: '',
  },
  eguna: 0,  // Representa el miércoles si 1 = lunes
  hasieraData: '',
  amaieraData: '',
  hasieraOrdua: '',
  amaieraOrdua: ''
  }
  

  constructor(
    private modalController: ModalController,
    private ikasleService: IkasleZerbitzuakService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    
    this.getGrupos();
    // Obtener alumnos
    this.getAlumnos();
    this.getHorarios();
  }


  getHorarios(): void {
    this.ikasleService.getHorarios().subscribe(
        (horarios) => {
          // Asignar los horarios obtenidos a ordutegiArray
          this.ordutegiArray = horarios;
          console.log('Horarios obtenidos:', this.ordutegiArray);
        },
        (error) => {
          console.error('Error al obtener los horarios:', error);
        }
      );
  }

  getDayName(k: number): string {
    if (k === 1) {
      return "Astelehena"; // Lunes
    } else if (k === 2) {
      return "Asteartea"; // Martes
    } else if (k === 3) {
      return "Asteazkena"; // Miércoles
    } else if (k === 4) {
      return "Osteguna"; // Jueves
    } else if (k === 5) {
      return "Ostirala"; // Viernes
    } else {
      return ""; // Si no es un valor válido de 1 a 7
    }
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
  
  // Función para guardar los horarios
 guardarHorario() {
  // Verifica si todos los campos necesarios están completos
  

  // Formatear las fechas a 'yyyy-MM-dd' y las horas a 'HH:mm:ss'
  const formattedFechaInicio = this.formatDate(this.fechaInicio);
  const formattedFechaFin = this.formatDate(this.fechaFin);
  const formattedHoraInicio = this.horaInicio + ":00";
  const formattedHoraFin = this.horaFin + ":00";

  const horarioData = {
    taldea: {
      "kodea": this.grupoSeleccionado.kodea,
    },
    "eguna": this.diaSeleccionado,
    "hasieraData": formattedFechaInicio,  // Convierte a formato YYYY-MM-DD
    "amaieraData": formattedFechaFin,     // Convierte a formato YYYY-MM-DD
    "hasieraOrdua": formattedHoraInicio,  // Asegúrate de que está en formato HH:mm:ss
    "amaieraOrdua": formattedHoraFin,     // Asegúrate de que está en formato HH:mm:ss
  };

  console.log(horarioData);

  // Usamos subscribe para manejar la respuesta
  this.ikasleService.guardarHorario(horarioData).subscribe(
    (data) => {
      this.ordutegiArray.push(data);
      // Aquí verificamos si el horario se ha guardado correctamente (comprobando el ID o cualquier otra propiedad)
      if (data && data.id) {
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

// Función para formatear la fecha a 'yyyy-MM-dd'
formatDate(date: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
