import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { HeaderComponent } from '../components/header/header.component';
import { LoginServiceService } from '../zerbitzuak/login-service.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import { ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ModoOscuroService } from '../zerbitzuak/Iluna.service';

import { LanguageService } from '../zerbitzuak/language.service';

export interface Alumno {
  nombre: string;
  grupo: string;
}

@Component({
  selector: 'app-materialak',
  templateUrl: './materialak.page.html',
  styleUrls: ['./materialak.page.scss'],
})
export class MaterialakPage implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  selectedLanguage: string = 'es';
  modal!: string;

  materialesSeleccionados: any[] = [];
  materialesSeleccionadosDevolver: any[] = [];
  filteredMaterialak: any[] = [];

  materialak!: any[];
  materialaDevolver!: any;

  crearKatNombre: String | null = null;
  crearNombre: String | null = null;
  crearEtiqueta: String | null = null;
  crearImg: String | null = null;
  crearCategoria: Number | null = null;

  editarKatNombre!: String;
  editarNombre!: String;
  editarEtiqueta!: String;
  editarImg!: String;
  editarCategoria!: Number;
  matDevolverId!: Number;

  seleccionarId!: Number;

  selectedCategoryId!: number;

  alumnos!: any[];
  selecTaldea!: number;
  selecAlumno!: number;

  mostrarFiltros: boolean = false;
  private routeSubscription: any;

  @ViewChild('modaleditarcat', { static: true })
  modaleditarcat!: IonModal;
  @ViewChild('modalEditar', { static: true })
  modalEditar!: IonModal;
  selectedCategory: any = {};
  selectedMateriala: any = {};

  modalAtera = false;
  alumne = '';
  categoriasAbiertas: { [key: string]: boolean } = {};
  filteredAlumnos!: any[];

  filtroCategoria: string = '';
  filtroMaterial: string = '';

  checkboxHabilitado:boolean = false;
  mostrarCheckbox: boolean = false;
  isIkasle!: boolean;
  modoOscuro: Boolean = false;

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
      this.languageService.setLanguage(this.selectedLanguage);
    }
  }

  transformarURL(url: any): string {
    if (url == null) {
      return 'assets/image-default.avif';
    }
    // Verificamos si el enlace es de Google Drive
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      return match ? `https://drive.google.com/thumbnail?id=${match[1]}` : url;
    }
  
    // Si es un enlace de imagen válido (JPG, PNG, GIF, WEBP), lo dejamos igual
    if (url.match(/(jpeg|jpg|gif|png|webp)$/i)) {
      return url;
    }
  
    // Si no es ni Google Drive ni una imagen directa, devolvemos un placeholder:
    return 'assets/image-default.avif';
  }

  onImageError(event: any) {
    event.target.src = 'assets/image-default.avif';
  }
  

  actualizarMaterialesSeleccionados(material: any) {
    const index = this.materialesSeleccionados.findIndex(p => p.id === material.id);
    if (material.selected && index === -1) {
      this.materialesSeleccionados.push(material);
    } else if (!material.selected && index !== -1) {
      this.materialesSeleccionados.splice(index, 1);
    }
    console.log('Materiales seleccionados:', this.materialesSeleccionados);
  }

  actualizarMaterialesSeleccionadosDevolver(material: any, isChecked: boolean) {
    const index = this.materialesSeleccionadosDevolver.findIndex(p => p.id === material.id);

    if (isChecked && index === -1) {
      this.materialesSeleccionadosDevolver.push(material);
    } else if (!isChecked && index !== -1) {
      this.materialesSeleccionadosDevolver.splice(index, 1);
    }
    material.selected = isChecked;
    console.log('Materiales seleccionados:', this.materialesSeleccionadosDevolver);
  }

  toggleMostrarCheckbox() {
    this.mostrarCheckbox = !this.mostrarCheckbox;

    if (this.mostrarCheckbox) {
      // Filtrar materiales
      this.filteredMaterialak = this.filteredMaterialak.map(material => {
        return {
          ...material,
          materialak: material.materialak.filter((m: any) =>
            !this.materialaDevolver.some((devolver: any) => devolver.materiala.etiketa === m.etiketa)
          )
        };
      }).filter(material => material.materialak.length > 0);

    } else {
      // Restaurar materiales
      this.filteredMaterialak = this.materialak;
    }

    console.log(this.filteredMaterialak);
    console.log(this.materialaDevolver);
  }

  /* Función para desmarcar el checkbox después de sacar los materiales */
  desmarcarCheckbox() {
    // this.mostrarCheckbox = false;  // Cambiar el valor del checkbox
    const checkboxElement = document.querySelector('ion-checkbox') as any;

    if (checkboxElement) {
      checkboxElement.checked = false;
      checkboxElement.dispatchEvent(new Event('ionChange')); // Disparar el evento manualmente
    }
  }


  toggleCategoria(categoria: string) {
    this.categoriasAbiertas[categoria] = !this.categoriasAbiertas[categoria];
  }

  isCategoriaAbierta(categoria: string): boolean {
    return this.categoriasAbiertas[categoria] || false;
  }

  async materialaSortu() {
    let data = {
      "etiketa": this.crearEtiqueta,
      "izena": this.crearNombre,
      "img_url": this.crearImg,
      "materialKategoria": {
        "id": this.crearCategoria
      }
    };

    let observableRest: Observable<any> = this.restServer.post<any>(`${environment.url}materialak`, data);

    observableRest.subscribe(
      async (datuak) => {
        console.log(datuak);
        this.translate.get('materiales.toast.Insert').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });

        this.materialakLortu();
        this.vaciarDatos();
      },
      async (error) => {
        this.translate.get('materiales.toast.Insert_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }

  materialaEditatu(id: number) {
    const data = {
      etiketa: this.editarEtiqueta,
      img_url: this.editarImg,
      izena: this.editarNombre,
      materialKategoria: {
        id: this.editarCategoria
      }
    };

    this.restServer.put<any>(`${environment.url}materialak/id/${id}`, data)
      .pipe(
        catchError(err => {
          this.translate.get('materiales.toast.Update_E').subscribe((texto) => {
            this.mostrarToast(texto, 2000, 'danger');
          });
          console.error(err);
          return of(null); // Si no se devuelve null, explota.
        })
      )
      .subscribe(datuak => {
        if (datuak) {
          console.log(datuak);
          this.materialakLortu();
          this.vaciarDatos();
          this.translate.get('materiales.toast.Update').subscribe((texto) => {
            this.mostrarToast(texto, 2000, 'success');
          });
          this.modalEditar.dismiss();
        }
      });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color
    });
    await toast.present();
  }

  vaciarDatos() {
    this.crearEtiqueta = null;
    this.crearImg = null;
    this.crearNombre = null;
    this.crearCategoria = null;
    this.crearKatNombre = null;
    this.materialesSeleccionados = [];
    this.desmarcarCheckbox(); // Desmarcamos el checkbox y disparamos el evento
  }

  async materialaEzabatu(id: number) {
    let observableRest: Observable<any> = this.restServer.delete<any>(`${environment.url}materialak/id/${id}`);

    observableRest.subscribe(
      async (datuak) => {
        console.log(datuak);
        this.translate.get('materiales.toast.Delete').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
        this.materialakLortu();
        this.vaciarDatos();
      },
      async (error) => {
        this.translate.get('materiales.toast.Delete_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }

  async mostrarToast(mensaje: string, duracion: number = 2000, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  toggleMaterialakLortu() {
    this.mostrarFiltros
  }

  materialakLortu() {
    let observableRest: Observable<any> = this.restServer.get<any>(`${environment.url}material_kategoria`);
    observableRest.subscribe(datuak => {
      console.log(datuak);

      this.materialak = datuak
        .filter((categoria: any) => categoria.ezabatzeData === null)
        .map((categoria: any) => ({
          ...categoria,
          materialak: categoria.materialak
            .filter((material: any) => material.ezabatzeData === null)
        }));
      this.filteredMaterialak = this.materialak;
    });
  }

  materialakLortuAtera() {
    let observableRest: Observable<any> = this.restServer.get<any>(`${environment.url}material_kategoria`);
    observableRest.subscribe(datuak => {
      console.log(datuak);
      const materialaDevolverIds = this.materialaDevolver.map((material: any) => material.id);

      this.materialak = datuak
        .filter((categoria: any) => categoria.ezabatzeData === null)
        .map((categoria: any) => ({
          ...categoria,
          materialak: categoria.materialak
            .filter((material: any) =>
              material.ezabatzeData === null &&
              !materialaDevolverIds.includes(material.id)
            )
        }));

      this.filteredMaterialak = this.materialak;
    });
  }

  materialakLortuDevolver() {
    let observableRest: Observable<any> = this.restServer.get<any>(`${environment.url}material_mailegua`);

    observableRest.subscribe(datuak => {
      this.materialaDevolver = datuak.filter((mailegu: any) =>
        mailegu.hasieraData && !mailegu.amaieraData
      );
      console.log(this.materialaDevolver);
    });
  }

  materialakAteraKargatu() {

  }

  langileakLortu() {
    let observableRest: Observable<any> = this.restServer.get<any>(`${environment.url}taldeak`);
    observableRest.subscribe(datuak => {
      console.log(datuak);

      this.alumnos = datuak
        .filter((kategoria: any) => kategoria.ezabatzeData === null)
        .map((kategoria: any) => ({
          ...kategoria,
          langileak: kategoria.langileak
            .filter((langilea: any) => langilea.ezabatzeData === null)
        }));
    });
  }

  abrirEditarCategoria(categoria: any) {
    this.modaleditarcat.present();
    this.selectedCategory = { ...categoria };
    this.editarKatNombre = this.selectedCategory.izena;
  }

  abrirEditarMaterial(material: any) {
    console.log(material);
    this.modalEditar.present();
    this.selectedMateriala = { ...material };
    this.editarNombre = material.izena;
    this.editarEtiqueta = material.etiketa;
    this.editarImg = material.img_url;
    this.editarCategoria = material.kategoriaId;
  }

  onGrupoChange() {
    if (!this.alumnos || this.alumnos.length === 0) {
      console.error('No hay datos en alumnos');
      this.filteredAlumnos = [];
      return;
    }
    const grupoSeleccionado = this.alumnos.find(taldea => taldea.kodea === this.selecTaldea);
    this.filteredAlumnos = grupoSeleccionado ? grupoSeleccionado.langileak : [];
  }

  async confirmarEliminarMaterial(id: number, izena: string) {
    const alert = await this.alertController.create({
      header: this.translate.instant('materiales.modal.confirmacion'),
      message: this.translate.instant('materiales.modal.mensajeAlertaBorrarMats') + " '" + izena + "'?",
      buttons: [
        {
          text: this.translate.instant('materiales.botones.cancelar'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('materiales.botones.borrar'),
          handler: () => {
            this.materialaEzabatu(id);
          },
        },
      ],
    });

    await alert.present();
  }
  async confirmarEliminarCategoria(id: number, izena: string) {
    const alert = await this.alertController.create({
      header: this.translate.instant('materiales.modal.confirmacion'),
      message: this.translate.instant('materiales.modal.mensajeAlertaBorrarCats') + " '" + izena + "'?",
      buttons: [
        {
          text: this.translate.instant('materiales.botones.cancelar'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('materiales.botones.borrar'),
          handler: () => {
            this.kategoriaEzabatu(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async kategoriaSortu() {
    let data = {
      "izena": this.crearKatNombre,
    }

    let observableRest: Observable<any> = this.restServer.post<any>(`${environment.url}material_kategoria`, data);
    await observableRest.subscribe(
      (datuak) => {
        console.log(datuak);
        this.materialakLortu();
        this.vaciarDatos();
        this.translate.get('materiales.toast.Kategoria_Insert').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
      },
      (error) => {
        console.error("Error al crear la categoría de material:", error);
        this.translate.get('materiales.toast.Kategoria_Insert_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }

  kategoriaEzabatu(id: number) {
    let observableRest: Observable<any> = this.restServer.delete<any>(`${environment.url}material_kategoria/id/${id}`);
    observableRest.subscribe(
      (datuak) => {
        console.log(datuak);
        this.materialakLortu();
        this.vaciarDatos();
        this.translate.get('materiales.toast.Kategoria_Delete').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
      },
      (error) => {
        console.error("Error al eliminar la categoría de material:", error);
        this.translate.get('materiales.toast.Kategoria_Delete_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }

  kategoriaEditatu(id: number) {
    let data = {
      "izena": this.editarKatNombre
    }

    let observableRest: Observable<any> = this.restServer.put<any>(`${environment.url}material_kategoria/id/${id}`, data);
    observableRest.subscribe(
      (datuak) => {
        console.log(datuak);
        this.materialakLortu();
        this.vaciarDatos();
        this.translate.get('materiales.toast.Kategoria_Update').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
      },
      (error) => {
        console.error("Error al editar la categoría de material:", error);
        this.translate.get('materiales.toast.Kategoria_Update_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }

  filtrarMateriales() {
    this.filteredMaterialak = this.materialak.map(categoria => ({
      ...categoria,
      materialak: categoria.materialak.map((material: any) => ({ ...material }))
    }));

    if (this.filtroCategoria !== '') {
      this.filteredMaterialak = this.filteredMaterialak.filter(categoria =>
        (this.filtroCategoria === '' || categoria.izena.toLowerCase().includes(this.filtroCategoria.toLowerCase()))
      );
    }

    if (this.filtroMaterial !== '') {
      this.filteredMaterialak = this.filteredMaterialak.map(categoria => ({
        ...categoria,
        materialak: categoria.materialak.filter((materiala: any) =>
          materiala.izena.toLowerCase().includes(this.filtroMaterial.toLowerCase())
        )
      }));
    }
  }

  constructor(private toastController: ToastController, 
    private translate: TranslateService,
     private restServer: HttpClient, 
     private alertController: AlertController,
      private loginService: LoginServiceService,
       private route: ActivatedRoute,
       private modoOscuroService: ModoOscuroService,
       private languageService: LanguageService
      ) 
  {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
    this.selectedLanguage = this.languageService.getLanguage();
  }

  ngOnInit() {
    this.selectedLanguage = this.languageService.getLanguage();
    // Suscribirse a los cambios de ruta
    this.routeSubscription = this.route.params.subscribe((params) => {
      console.log('Ruta cambiada:', params); // Si necesitas los parámetros de la ruta

      // Comprobar si el usuario es 'Ikasle' cada vez que se carga la página
      this.isIkasle = this.loginService.isAlumno();

      // Llamar a las funciones necesarias
      this.materialakLortu();
      this.langileakLortu();
      this.materialakLortuDevolver();
      this.cargarModoPreferido();
    });
  }

  ngOnDestroy() {
    // Limpiar la suscripción cuando el componente se destruya
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  materialakAtera() {
    const data = this.materialesSeleccionados.map(materiala => ({
      materiala: { id: materiala.id },
      langilea: { id: this.selecAlumno }
    }));

    const observableRest: Observable<any> = this.restServer.post<any>(`${environment.url}material_mailegua`, data);

    observableRest.subscribe(
      () => {
        this.vaciarDatos();
        this.materialakLortu();
        this.materialakLortuDevolver();
        this.translate.get('materiales.toast.sacar_Material').subscribe((texto) => { // Material Prestado
          this.mostrarToast(texto, 2000, 'success');
        });
      },
      (error) => {
        console.error('Errorea materialak ateratzerakoan:', error);
        this.translate.get('materiales.toast.sacar_Material_E').subscribe((texto) => { // Material Prestado E
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }


  materialakBueltatu() {
    const data = this.materialesSeleccionadosDevolver.map(mailegu => ({
      id: mailegu.id
    }));

    const observableRest: Observable<any> = this.restServer.put<any>(`${environment.url}material_mailegua`, data);

    observableRest.subscribe(
      (datuak) => {
        this.materialaDevolver = datuak;
        this.materialakLortu();
        this.materialakLortuDevolver();
        this.vaciarDatos();
        this.translate.get('materiales.toast.devolver_Material').subscribe((texto) => { // Material Devuelto
          this.mostrarToast(texto, 2000, 'success');
        });
      },
      (error) => {
        console.error('Errorea materialak bueltatzerakoan:', error);
        this.translate.get('materiales.toast.devolver_Material_E').subscribe((texto) => { // Material Devuelto E
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }
  cargarModoPreferido() {
    this.modoOscuro = this.modoOscuroService.getModoOscuro();
    if (this.modoOscuro) {
      this.activarModoOscuro();
    }
  }

  activarModoOscuro() {
    document.body.classList.add('dark');
    const ionContent = document.querySelector('ion-content');
    if (ionContent) {
      ionContent.classList.add('dark'); 
    }
  }

  desactivarModoOscuro() {
    document.body.classList.remove('dark');
    const ionContent = document.querySelector('ion-content');
    if (ionContent) {
      ionContent.classList.remove('dark'); 
    }
  }

  ponerModoOscuro() {
    this.modoOscuro = !this.modoOscuro;
    if (this.modoOscuro) {
      this.activarModoOscuro();
    } else {
      this.desactivarModoOscuro();
    }
    this.modoOscuroService.setModoOscuro(this.modoOscuro);
  }
}