import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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

  // Método para abrir la alerta de edición
  async editTxanda(txanda: Txanda) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Txanda',
      inputs: [
        {
          name: 'mota',
          type: 'text',
          value: txanda.mota,  // Valor por defecto de mota
          placeholder: 'Mota de la txanda',
        },
        {
          name: 'data',
          type: 'text',
          value: txanda.data,  // Valor por defecto de data
          placeholder: 'Fecha',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Actualizar',
          handler: (alertData) => {
            // Se ejecuta cuando se confirma la edición
            const updatedTxanda: Txanda = {
              ...txanda,
              mota: alertData.mota,  // Actualizamos el campo mota
              data: alertData.data,  // Actualizamos el campo data
            };
            this.updateTxanda(updatedTxanda);
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para actualizar la txanda (llama a la API)
  updateTxanda(txanda: Txanda) {
    const apiUrl = `http://localhost:8080/api/txandak/${txanda.id}`;

    this.http.put<Txanda>(apiUrl, txanda).subscribe(
      (updatedTxanda) => {
        // Actualizamos la txanda en la lista local después de la actualización
        const index = this.txandak.findIndex(t => t.id === updatedTxanda.id);
        if (index !== -1) {
          this.txandak[index] = updatedTxanda;
        }
      },
      (error) => {
        console.error('Error al actualizar la txanda', error);
      }
    );
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
  
  
  // Método para añadir una nueva txanda
  async addTxanda() {
    const alumnos = this.txandak.map(txanda => txanda.alumno);  // Obtener los alumnos de las txandas existentes
  
    const alert = await this.alertCtrl.create({
      header: 'Añadir Txanda',
      inputs: [
        {
          name: 'mota',
          type: 'text',
          placeholder: 'Mota de la txanda',
        },
        {
          name: 'data',
          type: 'date',  // Selección de fecha
          placeholder: 'Fecha',
        },
        // Selección de un alumno por ID (radio button para selección única)
        {
          name: 'alumno',
          type: 'radio',  // Usamos 'radio' para permitir solo una selección
          label: 'Selecciona un alumno',
          value: null, // Valor inicial si no se selecciona nada
          // Generamos los radio buttons dinámicamente
          options: alumnos.map(alumno => ({
            text: `${alumno?.izena} ${alumno?.abizenak}`, // Nombre completo del alumno
            value: alumno?.id  // El valor será el ID del alumno
          })),
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Añadir txanda cancelado');
          }
        },
        {
          text: 'Añadir',
          handler: (alertData) => {
            // El valor de alertData.alumno será el ID del alumno seleccionado
            const selectedAlumnoId = alertData.alumno;
  
            if (selectedAlumnoId) {
              // Encontramos el alumno correspondiente por el ID
              const selectedAlumno = alumnos.find(alumno => alumno.id === selectedAlumnoId);
  
              if (selectedAlumno) {
                // Crear la nueva txanda con el alumno seleccionado
                const newTxanda: Txanda = {
                  mota: alertData.mota,
                  data: alertData.data,
                  alumno: selectedAlumno.id  // Solo guardamos el ID del alumno seleccionado
                };
                this.createTxanda(newTxanda);
              } else {
                console.error('Alumno no encontrado');
              }
            } else {
              console.error('No se seleccionó ningún alumno');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  
  

// Método para crear una txanda en la API
createTxanda(txanda: Txanda) {
  const apiUrl = 'http://localhost:8080/api/txandak';

  this.http.post<Txanda>(apiUrl, txanda).subscribe(
    (createdTxanda) => {
      // Añadir la nueva txanda a la lista local
      this.txandak.push(createdTxanda);
    },
    (error) => {
      console.error('Error al crear la txanda', error);
    }
  );
}



}
