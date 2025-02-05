import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  ikasleak: Ikaslea[] = [];
  filteredAlumnos: Ikaslea[] = [];
  nuevaTxanda = {
    mota: '', // Tipo de txanda
    data: '', // Fecha de la txanda
    alumno: null, // ID del alumno
  };
  
  constructor(private translate: TranslateService, 
              private http: HttpClient,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    // Iniciar traducción al idioma por defecto
    this.translate.setDefaultLang(this.selectedLanguage);
    
    // Llamar al método para obtener los txandas
    this.getTxandak();
    this.getAlumnos();
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);  // Cambiar el idioma según la selección
  }

  getAlumno(id: number) {
    return this.filteredAlumnos.find(ikaslea => ikaslea.id === id);
  }
  

  getTxandak() {
    const apiUrl = 'http://localhost:8080/api/txandak';
    this.http.get<Txanda[]>(apiUrl).subscribe(
      (data) => {
        console.log('Respuesta completa de Txandas:', data);  // Verifica toda la respuesta
  
        this.txandak = data
          .filter(txanda => !txanda.ezabatzeData) // Filtramos las txandas eliminadas
          .map(txanda => {
            console.log("txanda antes del mapeo:", txanda);  // Verifica cada txanda antes de asignarla
  
            if (!txanda.id) {
              console.error('Txanda sin ID:', txanda); // Aquí se verá si alguna txanda tiene ID undefined
            }
  
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
  
        console.log('Txandak después del mapeo:', this.txandak);  // Verifica la lista final de txandak
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
    // Crear la alerta de confirmación
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Txanda',
      message: '¿Estás seguro de que deseas eliminar esta txanda?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Verificar que el id está disponible
            if (!txandaId) {
              console.error('El id de la txanda no está definido');
              return;
            }
  
            // Realizar la solicitud DELETE
            const apiUrl = `http://localhost:8080/api/txandak/${txandaId}`; // URL de la API para eliminar la txanda
            this.http.delete<Txanda>(apiUrl).subscribe(
              (response) => {
                // Eliminar la txanda de la lista local después de la eliminación en el servidor
                const index = this.txandak.findIndex(t => t.id === txandaId);
                if (index !== -1) {
                  this.txandak.splice(index, 1);  // Eliminar la txanda de la lista local
                  console.log('Txanda eliminada correctamente:', response);
                }
              },
              (error) => {
                console.error('Error al eliminar la txanda', error);
              }
            );
          }
        }
      ]
    });
  
    // Presentar la alerta
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
  guardarTxanda() {
    if (!this.nuevaTxanda.mota || !this.nuevaTxanda.data || !this.nuevaTxanda.alumno) {
      console.log('Faltan datos');
      return; // Validar que no haya campos vacíos
    }

    const txandaToSave = {
      mota: this.nuevaTxanda.mota,
      data: this.nuevaTxanda.data,
      alumno: { id: this.nuevaTxanda.alumno }, // Aquí asumimos que el alumno tiene solo un ID
    };
    const apiUrl = `http://localhost:8080/api/txandak`; // URL de la API para eliminar la txanda

    // Realizar la solicitud HTTP POST para crear la txanda
    this.http.post(apiUrl, txandaToSave)
      .pipe(
        catchError(err => {
          console.error('Error al crear la txanda', err);
          return of(null); // Retornar un observable vacío en caso de error
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('Txanda guardada correctamente', response);
          this.closeModal(); // Cerrar el modal si la txanda se guarda correctamente
        } else {
          console.error('No se pudo guardar la txanda');
        }
      });
  }

  // Función para mostrar los datos de la txanda (solo para demostración)
  mostrarTxanda() {
    console.log('Txanda:', this.nuevaTxanda);
  }

}
