import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import {IkasleZerbitzuakService, Ikaslea, Taldea, Horario,} from './../zerbitzuak/ikasle-zerbitzuak.service';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-ikasleak',
  templateUrl: './ikasleak.page.html',
  styleUrls: ['./ikasleak.page.scss'],
})


export class IkasleakPage implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  selectedLanguage: string = 'es';
  searchQuery: string = '';
  ikasleak: Ikaslea[] = [];
  ikasleArray: any[] = [];
  filteredAlumnos: any[] = [];
  selectedAlumno: any = null;
  selectedIkasleak: Set<number> = new Set();
  nuevoAlumno: any = {izena: '', abizenak: '', taldea: { kodea: '' },};
  isEditModalOpen: boolean = false;
  nuevoGrupo: any = { kodea: '', izena: '' };
  selectedTalde: any = null;
  ordutegiArray: any[] = [];
  isEditTaldeModalOpen: boolean = false;
  fecha: string = '';
  horaInicio: any = null;
  horaFin: any = null;
  fechaInicio: any = null;
  fechaFin: any = null;
  idHorario: any = null;
  grupoSeleccionado: Taldea = { kodea: '', izena: '' };
  diaSeleccionado: number = 0;
  ordutegia: Horario = {taldea: {kodea: '',},eguna: 0,hasieraData: '',amaieraData: '',hasieraOrdua: '',amaieraOrdua: '',};
  selectedHorario: Horario = {id: 0,hasieraData: '',hasieraOrdua: '',amaieraData: '',amaieraOrdua: '',eguna: 0,taldea: { kodea: '' },};

  constructor(
    private translate: TranslateService,
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

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  getHorarios(): void {
    this.ikasleService.getHorarios().subscribe(
      (horarios) => {
        // Filtrar los horarios que no tienen datos en 'ezabatze_data' (null, undefined o vacío)
        this.ordutegiArray = horarios.filter((horario) => {
          const isDeletedTalde = this.ikasleArray.some(
            (grupo) => grupo.kodea === horario.taldea.kodea && grupo.ezabatzeData
          );
          return !horario.ezabatzeData && !isDeletedTalde; // Filtra los horarios cuyo taldea no ha sido eliminado
        })
        console.log('Horarios obtenidos y filtrados:', this.ordutegiArray);
      },
      (error) => {
        console.error('Error al obtener los horarios:', error);
      }
    );
  }

  getDayName(k: number): string {
    if (k === 1) {
      return 'Astelehena'; // Lunes
    } else if (k === 2) {
      return 'Asteartea'; // Martes
    } else if (k === 3) {
      return 'Asteazkena'; // Miércoles
    } else if (k === 4) {
      return 'Osteguna'; // Jueves
    } else if (k === 5) {
      return 'Ostirala'; // Viernes
    } else {
      return ''; // Si no es un valor válido de 1 a 7
    }
  }

  // Método para obtener los alumnos de la API
  getAlumnos() {
    this.ikasleService.getAlumnos().subscribe((data: Ikaslea[]) => {
      this.filteredAlumnos = data.filter((ikaslea) => !ikaslea.ezabatzeData); // Asignar los alumnos a la propiedad ikasleak
    });
  }

  async getGrupos() {
    this.ikasleService.getGrupos().subscribe((data: any[]) => {
      this.ikasleArray = data
        .filter((grupo:any) => grupo.ezabatzeData === null)
        .map((grupo:any) => ({
          ...grupo,
          langileak: grupo.langileak.filter((langile:any) => langile.ezabatzeData === null)}));
      console.log(this.ikasleArray); // Esto es solo para verificar que se están cargando correctamente
    });
  }

  openEditModal(ikaslea: any) {
    this.selectedAlumno = ikaslea;
    console.log(this.selectedAlumno)
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  filterAlumnos() {
    const query = this.searchQuery.trim().toLowerCase();
    if(this.searchQuery !== ''){
      this.filteredAlumnos = query
      ? this.filteredAlumnos.filter((ikaslea) =>
          `${ikaslea.izena} ${ikaslea.abizenak} ${ikaslea.taldeKodea} ${ikaslea.taldeIzena}`
            .toLowerCase()
            .includes(query)
        )
      : [...this.filteredAlumnos];
    }else{
      this.getAlumnos();
    }
    
  }

  eliminarAlumnos() {
    this.selectedIkasleak.forEach((id) => {
      this.ikasleService.eliminarAlumno(id).subscribe(() => {
        // Eliminar el alumno de la lista
        this.getAlumnos();
        this.getGrupos();
      });
    });
    this.selectedIkasleak.clear(); // Limpiar la selección después de eliminar
  }

  async agregarAlumno() {
    let data = {
      izena: this.nuevoAlumno.izena,
      abizenak: this.nuevoAlumno.abizenak,
      taldea: {
        kodea: this.nuevoAlumno.taldea.kodea,
      },
    };
    console.log(data);
    this.ikasleService.agregarAlumno(data).subscribe((data) => {
      this.getAlumnos();
      this.getGrupos();
      this.modalController.dismiss();
    });
    this.nuevoAlumno = {
      izena: '',
      abizenak: '',
      taldea: { kodea: '', izena: '' },
    };
  }

  async agregarGrupo() {
    let data = {
      kodea: this.nuevoGrupo.kodea,
      izena: this.nuevoGrupo.izena,
    };

    this.ikasleService.agregarGrupo(data).subscribe((data) => {
      this.getGrupos();
      this.getAlumnos();
      this.modalController.dismiss();
    });
    this.nuevoGrupo = { kodea: '', izena: '' };
  }

  // Abre el modal para editar un talde
  openEditTaldeModal(talde: any) {
    this.selectedTalde = talde; // Clonar el objeto seleccionado
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
      izena: this.selectedTalde.izena,
    };

    this.ikasleService.updateGrupo(updatedTalde).subscribe(() => {
      this.getAlumnos();
      this.getGrupos();
      this.closeEditTaldeModal();
    });
  }

  updateAlumno() {
    const updatedAlumno = {
      id: this.selectedAlumno.id,
      izena: this.selectedAlumno.izena,
      abizenak: this.selectedAlumno.abizenak,
      taldea: { 
        kodea:this.selectedAlumno.taldeKodea
      },
    };

    this.ikasleService.updateAlumno(updatedAlumno).subscribe(() => {
      this.getGrupos();
      this.getAlumnos();
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
          },
        },
        {
          text: 'Ezabatu',
          handler: () => {
            this.eliminarGrupo(grupoKodea);
          },
        },
      ],
    });

    await alert.present();
  }

  eliminarGrupo(grupoKodea: string) {
    // Llamamos al servicio que gestiona la eliminación de grupos
    this.ikasleService.eliminarGrupo(grupoKodea).subscribe(
      (response) => {
        this.getGrupos();
        this.getAlumnos();
        alert('Taldea ezabatuta');
      },
      (error) => {
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
    const formattedHoraInicio = this.horaInicio + ':00';
    const formattedHoraFin = this.horaFin + ':00';
  
    this.ordutegia = {
      taldea: {
        kodea: this.grupoSeleccionado.kodea,
      },
      eguna: this.diaSeleccionado,
      hasieraData: formattedFechaInicio, // Convierte a formato YYYY-MM-DD
      amaieraData: formattedFechaFin, // Convierte a formato YYYY-MM-DD
      hasieraOrdua: formattedHoraInicio, // Asegúrate de que está en formato HH:mm:ss
      amaieraOrdua: formattedHoraFin, // Asegúrate de que está en formato HH:mm:ss
    };
    console.log(JSON.stringify(this.ordutegia));
    // Usamos subscribe para manejar la respuesta
    this.ikasleService.guardarHorario(this.ordutegia).subscribe(
      (data) => {
        // Si el horario se guarda correctamente, agrega a la lista de horarios
        this.getHorarios();
        // Reseteo de los campos después de guardar
        this.ordutegia = {
          taldea: {
            kodea: '', // Vacia el código de grupo
          },
          eguna: 0, // Resetea el día seleccionado
          hasieraData: '', // Resetea la fecha de inicio
          amaieraData: '', // Resetea la fecha de fin
          hasieraOrdua: '', // Resetea la hora de inicio
          amaieraOrdua: '', // Resetea la hora de fin
        };
        this.grupoSeleccionado.kodea = ''; // Resetea el grupo seleccionado
        this.diaSeleccionado = 0; // Resetea el día seleccionado
        this.fechaInicio = ''; // Resetea la fecha de inicio
        this.fechaFin = ''; // Resetea la fecha de fin
        this.horaInicio = null; // Resetea la hora de inicio
        this.horaFin = null; // Resetea la hora de fin
        console.log(data);
        // Verifica si el horario se ha guardado correctamente
        if (data && data.id) {
          this.showAlert('Éxito', 'Horario guardado correctamente');
        } else {
          console.log('Error al guardar');
          this.showAlert('Error', 'Hubo un error al guardar el horario');
        }
      },
      (error) => {
        console.error('Error al guardar el horario:', error);
        this.showAlert('Error', 'Hubo un problema con la conexión');
      }
    );
    this.closeModal();
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
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Función para cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }

  openModal(horario: any, modal: IonModal) {
    console.log(horario)
    // Asignar los valores del horario seleccionado al formulario
    this.selectedHorario = horario;
    this.idHorario = horario.id;
    this.grupoSeleccionado = horario.taldea;
    this.diaSeleccionado = horario.eguna;
    this.fechaInicio = horario.hasieraData;
    this.fechaFin = horario.amaieraData;
    this.horaInicio = horario.hasieraOrdua;
    this.horaFin = horario.amaieraOrdua;
    // Abrir el modal manualmente
    modal.present();
  }

  horarioSeleccionado: any; // Asegúrate de tener un horario seleccionado
  // Otras propiedades del componente
  seleccionarHorario(horario: any) {
    this.horarioSeleccionado = horario;
    // Aquí puedes agregar lógica adicional si es necesario
  }

  actualizarHorario() {
    if (this.selectedHorario) {
      console.log('Horario seleccionado:', this.selectedHorario); // Verifica que el id esté presente
      const horarioActualizado: any = {
        ...this.selectedHorario,
        taldea: this.grupoSeleccionado,
        eguna: this.diaSeleccionado,
        hasieraData: this.fechaInicio,
        amaieraData: this.fechaFin,
        hasieraOrdua: this.horaInicio,
        amaieraOrdua: this.horaFin,
        eguneratzeData: new Date().toISOString(),
      };
      // Si el id es undefined aquí, podría ser que no se esté asignando correctamente
      if (horarioActualizado.id) {
        this.ikasleService.actualizarHorario(horarioActualizado).subscribe(
          (response) => {
            this.getHorarios();
            console.log('Horario actualizado:', response);
            // Resetear el horario seleccionado
            this.selectedHorario = {
              id: 0,
              hasieraData: '',
              hasieraOrdua: '',
              amaieraData: '',
              amaieraOrdua: '',
              eguna: 0,
              taldea: { kodea: '' },
            };
          },
          (error) => {
            console.error('Error al actualizar el horario:', error);
          }
        );
      } else {
        console.error('El id del horario es undefined');
      }
    }
  }

  deleteHorario(horario: any): void {
    // Crear la alerta de confirmación
    this.alertController
      .create({
        header: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar el horario de ${horario.taldea.kodea}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Eliminación cancelada');
            },
          },
          {
            text: 'Aceptar',
            handler: () => {
              this.ikasleService
                .eliminarHorario(horario.id)
                .subscribe((response) => {
                  this.getHorarios();
                  console.log('Horario eliminado', response);
                });
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
