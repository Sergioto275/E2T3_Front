import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';
import { catchError } from 'rxjs/operators';

// Interfaz movida fuera de la clase
export interface Txanda {
  id?: number;
  mota: string;
  data: string;
  langileak?: Ikaslea;
  sortzeData?: string;
  eguneratzeData?: string;
  ezabatzeData?: null;
  alumno?: Ikaslea;  // Aquí añadimos la relación con el alumno
}

export interface Ikaslea {
  id?: number;
  izena: string;
  abizenak: string;
  ezabatzeData?: null;
}

@Component({
  selector: 'app-txandak',
  templateUrl: './txandak.page.html',
  styleUrls: ['./txandak.page.scss'],
})

export class TxandakPage implements OnInit {
  selectedLanguage: string = 'es';
  txandak: Txanda[] = [];  // Lista de txandas
  filteredTxandak: Txanda[]=[];  // Lista filtrada de txandas

  ikasleak: Ikaslea[] = [];
  filteredAlumnos: Ikaslea[] = [];
  nuevaTxanda = {
    mota: '', // Tipo de txanda
    data: '', // Fecha de la txanda
    alumno: null, // ID del alumno
  };
  selectedType = 'all';  // Tipo de txanda seleccionado
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private translate: TranslateService, 
              private http: HttpClient,
              private toastController: ToastController,              
              private alertCtrl: AlertController) { }

  ngOnInit() {
    // Iniciar traducción al idioma por defecto
    this.translate.setDefaultLang(this.selectedLanguage);
    
    // Llamar al método para obtener los txandas
    this.getTxandak();
    this.getAlumnos();
    this.filterTxandas();  // Llamada inicial al filtro para mostrar todas las txandas

  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);  // Cambiar el idioma según la selección
  }

  getAlumno(id: number) {
    return this.filteredAlumnos.find(ikaslea => ikaslea.id === id);
  }
  
  // Función para filtrar txandas por tipo
  filterTxandas() {
    if (this.selectedType === 'all') {
      this.filteredTxandak = this.txandak;
    } else {
      this.filteredTxandak = this.txandak.filter(txanda => txanda.mota === this.selectedType);
    }
  }

  getTxandak() {
    const apiUrl = 'http://localhost:8080/api/txandak';
    this.http.get<Txanda[]>(apiUrl).subscribe(
      (data) => {
  
        this.txandak = data
          .filter(txanda => !txanda.ezabatzeData) // Filtramos las txandas eliminadas
          .map(txanda => {  
            const alumno = txanda.langileak;  // Ahora accedemos a langileak, que contiene al alumno completo
            console.log("Alumno encontrado:", alumno);
  
            if (alumno) {
              txanda.alumno = alumno;  // Asignamos el alumno a txanda
            } else {
              console.log(`Alumno no encontrado para el id: ${txanda.langileak?.id}`);
            }
  
            return {
              mota: txanda.mota,
              data: txanda.data,
              alumno: txanda.alumno,  // Asignamos el alumno completo
              id: txanda.id,  // Aseguramos que el id se conserve
            };
          });
  
        this.filterTxandas();  // Llamar a filterTxandas para filtrar y mostrar las txandas

      },
      (error) => {
        console.error('Error al cargar las txandas', error);
      }
    );
  }
  

  getAlumnos() {
    this.http.get<Ikaslea[]>('http://localhost:8080/api/langileak').subscribe((data: Ikaslea[]) => {
      this.ikasleak = data.filter((ikaslea) => !ikaslea.ezabatzeData); // Filtramos los alumnos con ezabatzeData no nulo
      this.filteredAlumnos = [...this.ikasleak]; // Inicializamos la lista filtrada con todos los alumnos
      console.log(this.filteredAlumnos);
    });
  }

  async deleteTxanda(txandaId: number) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('txandakPage.MessageEliminar'),
      message: this.translate.instant('txandakPage.MessageSeguroEliminar'),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            const apiUrl = `http://localhost:8080/api/txandak/${txandaId}`;
            this.http.delete<Txanda>(apiUrl).subscribe(
              (response) => {
                const index = this.txandak.findIndex(t => t.id === txandaId);
                if (index !== -1) {
                  this.txandak.splice(index, 1);
                  this.mostrarToast(this.translate.instant('txandakPage.TxandaEzabatuta'), 'success');
                }
              },
              (error) => {
                this.mostrarToast(this.translate.instant('txandakPage.TxandaEzabatutaArazoa'), 'danger');
              }
            );
          },
        },
      ],
    });
    await alert.present();
  }
  
  
  openModal() {
    this.nuevaTxanda = { mota: '', data: '', alumno: null }; // Resetear el formulario
  }

  // Función para cerrar el modal (se puede utilizar el modalController también)
  closeModal() {
    this.nuevaTxanda = { mota: '', data: '', alumno: null }; // Resetear datos
    // Aquí cerramos el modal manualmente si no se usa 'trigger'
    // this.modalController.dismiss();
  }  

  // Función para guardar la nueva txanda
  // Función para guardar la nueva txanda
  guardarTxanda() {
    if (!this.nuevaTxanda.mota || !this.nuevaTxanda.alumno) {
      return;
    }

    if (!this.nuevaTxanda.data) {
      this.nuevaTxanda.data = new Date().toISOString().split('T')[0];
    }

    const txandaToSave = {
      mota: this.nuevaTxanda.mota,
      data: this.nuevaTxanda.data,
      langileak: { id: this.nuevaTxanda.alumno },
    };

    const apiUrl = `http://localhost:8080/api/txandak`;
    console.log(JSON.stringify(txandaToSave));

    this.http.post(apiUrl, txandaToSave).subscribe(
      (response) => {
        if (response) {
          this.getTxandak();
          this.closeModal();
          this.mostrarToast(this.translate.instant('txandakPage.TxandaGuardada'), 'success');
        } 
      },
      (error) => {
        this.mostrarToast(this.translate.instant('txandakPage.TxandaEzGuardada'), 'danger');
      }
    );
  }

  async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
    });
    toast.present();
  }

  // Método para filtrar las txandas por fecha
  filterByDate() {
    // Filtrar txandas por el rango de fechas si ambos están presentes
    if (this.fechaInicio && this.fechaFin) {
      this.filteredTxandak = this.txandak.filter(txanda => {
        return (
          new Date(txanda.data) >= new Date(this.fechaInicio) &&
          new Date(txanda.data) <= new Date(this.fechaFin)
        );
      });
    } else {
      // Si no hay fechas seleccionadas, mostrar todas las txandas
      this.filteredTxandak = [...this.txandak];
    }
  }

  resetFilters() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filteredTxandak = [...this.txandak];
  }

  filterToday() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato 'YYYY-MM-DD'

    this.filteredTxandak = this.txandak.filter(txanda => {
      return txanda.data === today; // Filtrar las txandas que tengan la fecha igual a la de hoy
    });
  }
}
