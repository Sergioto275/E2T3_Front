import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../components/header/header.component';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../zerbitzuak/login-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ModoOscuroService } from '../zerbitzuak/Iluna.service';
import { LanguageService } from '../zerbitzuak/language.service';

@Component({
  selector: 'app-tratamenduak',
  templateUrl: './tratamenduak.page.html',
  styleUrls: ['./tratamenduak.page.scss'],
})
export class TratamenduakPage implements OnInit {

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  selectedLanguage: string = 'es';
  zerbitzuak: any[] = [];
  filteredZerbitzuak: any[] = [];
  modalAtera = false;
  alumne = '';
  categoriasAbiertas: { [key: string]: boolean } = {};
  filteredAlumnos!: any[];
  selectedCategoryId!: number;
  crearServicio: any = { izena: '', idKategoria: null, kanpokoPrezioa: '', etxekoPrezioa: '' };
  crearCategoria: any = { izena: '', kolorea: false, extra: false };
  editarCategoria: any;
  editarServicio: any;
  serviciosSeleccionados: any[] = [];
  isEditingService: boolean = false;
  isEditingCategoria: boolean = false;

  filtroCategoria: string = '';
  filtroZerbitzua: string = '';
  isIkasle!: boolean;
  modoOscuro: Boolean = false;
  private routeSubscription: any;

  constructor(private toastController: ToastController, 
    private translate: TranslateService, 
    private http: HttpClient, 
    private loginService: LoginServiceService, 
    private router: Router, 
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private modoOscuroService: ModoOscuroService) 
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

      // Si es Ikasle, redirigir a '/home'
      if (this.isIkasle) {
        this.router.navigate(['/home']);
      }

      // Llamar a las funciones necesarias
      this.zerbiztuakLortu();
    });
    this.cargarModoPreferido();
  }

  ngOnDestroy() {
    // Limpiar la suscripción cuando el componente se destruya
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    this.languageService.setLanguage(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
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

  filtrarZerbitzuak() {
    this.filteredZerbitzuak = this.zerbitzuak.map(categoria => ({
      ...categoria,
      zerbitzuak: categoria.zerbitzuak.map((zerbitzua: any) => ({ ...zerbitzua }))
    }));

    if (this.filtroCategoria !== '') {
      this.filteredZerbitzuak = this.filteredZerbitzuak.filter(categoria =>
        (this.filtroCategoria === '' || categoria.izena.toLowerCase().includes(this.filtroCategoria.toLowerCase()))
      );
    }

    if (this.filtroZerbitzua !== '') {
      this.filteredZerbitzuak = this.filteredZerbitzuak.map(categoria => ({
        ...categoria,
        produktuak: categoria.produktuak.filter((producto: any) =>
          producto.izena.toLowerCase().includes(this.filtroZerbitzua.toLowerCase())
        )
      }));
    }
  }

  openServiceModal(service: any, idKat: number) {
    this.isEditingService = true;
    this.editarServicio = service;
    this.editarServicio.idKategoria = idKat;
    console.log(this.editarServicio);
  }

  closeServiceModal() {
    this.isEditingService = false;
  }

  openKatModal(kategoria: any) {
    this.isEditingCategoria = true;
    this.editarCategoria = kategoria;
    console.log(this.editarCategoria);
  }

  closeKatModal() {
    this.isEditingCategoria = false;
  }

  toggleCategoria(categoria: string) {
    this.categoriasAbiertas[categoria] = !this.categoriasAbiertas[categoria];
  }

  isCategoriaAbierta(categoria: string): boolean {
    return this.categoriasAbiertas[categoria] || false;
  }

  zerbiztuakLortu() {
    this.http.get(`${environment.url}zerbitzu_kategoria`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }).subscribe(
      (datuak: any) => {
        this.zerbitzuak = datuak
          .filter((categoria: any) => categoria.ezabatzeData === null)
          .map((categoria: any) => ({
            ...categoria,
            zerbitzuak: categoria.zerbitzuak
              .filter((zerbitzua: any) => zerbitzua.ezabatzeData === null)
          }));

        this.filteredZerbitzuak = this.zerbitzuak;
        console.log('zerbitzuak kargatu:', this.zerbitzuak);
      },
      (error) => {
        console.error('Errorea zerbitzuak kargatzerakoan:', error);
      }
    );
  }

  sortuZerbitzua() {
    const json_data = {
      "izena": this.crearServicio.izena,
      "zerbitzuKategoria": {
        "id": this.crearServicio.idKategoria
      },
      "etxekoPrezioa": this.crearServicio.etxekoPrezioa,
      "kanpokoPrezioa": this.crearServicio.kanpokoPrezioa,
      "img_url": this.crearServicio.img_url
    };

    console.log(json_data);

    this.http.post(`${environment.url}zerbitzuak`, json_data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe(
      async (response) => {
        console.log('Servicio creado correctamente');
        this.translate.get('servicios.toast.Insert').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
        this.zerbiztuakLortu();
      },
      async (error) => {
        console.error('Error al crear el servicio:', error);
        this.translate.get('servicios.toast.Insert_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }


  editarServicios() {
    const json_data = {
      "id": this.editarServicio.id,
      "izena": this.editarServicio.izena,
      "zerbitzuKategoria": {
        "id": this.editarServicio.idKategoria
      },
      "etxekoPrezioa": this.editarServicio.etxekoPrezioa,
      "kanpokoPrezioa": this.editarServicio.kanpokoPrezioa,
      "img_url": this.editarServicio.img_url
    };

    console.log(json_data);

    this.http.put(`${environment.url}zerbitzuak`, json_data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe(
      async (response) => {
        console.log('Servicio actualizado correctamente');
        this.translate.get('servicios.toast.Update').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
        this.zerbiztuakLortu();
      },
      async (error) => {
        console.error('Errorea zerbitzua eguneratzerakoan:', error);
        this.translate.get('servicios.toast.Update_E').subscribe((texto) => {
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

  eliminarServicio(id: number) {
    const url = `${environment.url}zerbitzuak/${id}`;

    this.http.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe(
      async (response) => {
        console.log('Servicio eliminado correctamente');
        this.translate.get('servicios.toast.Delete').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
        this.zerbiztuakLortu();
      },
      async (error) => {
        console.error('Errorea zerbitzua ezabatzerakoan:', error);

        // Mostrar toast de error
        this.translate.get('servicios.toast.Delete_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }

  crearKategoria() {
    const json_data = {
      "izena": this.crearCategoria.izena,
      "kolorea": this.crearCategoria.kolorea,
      "extra": this.crearCategoria.extra
    };
    console.log(json_data);

    this.http.post(`${environment.url}zerbitzu_kategoria`, json_data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe(
      async (response) => {
        this.translate.get('servicios.toast.Kategoria_Insert').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
        this.zerbiztuakLortu();
        this.closeKatModal();
      },
      async (error) => {
        console.error('Error al crear la categoría de servicio:', error);
        this.translate.get('servicios.toast.Kategoria_Insert_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }

  editarKategoria() {
    const json_data = {
      "id": this.editarCategoria.id,
      "izena": this.editarCategoria.izena,
      "kolorea": this.editarCategoria.kolorea,
      "extra": this.editarCategoria.extra
    };
    console.log(json_data);

    this.http.put(`${environment.url}zerbitzu_kategoria`, json_data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe(
      async (response) => {
        this.translate.get('servicios.toast.Kategoria_Update').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
        this.zerbiztuakLortu();
        this.closeKatModal();
      },
      async (error) => {
        console.error('Error al editar la categoría de servicio:', error);
        this.translate.get('servicios.toast.Kategoria_Update_E').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'danger');
        });
      }
    );
  }

  eliminarKategoria(id: number) {
    this.http.delete(`${environment.url}zerbitzu_kategoria/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe(
      async (response) => {
        this.translate.get('servicios.toast.Kategoria_Delete').subscribe((texto) => {
          this.mostrarToast(texto, 2000, 'success');
        });
        this.zerbiztuakLortu();
      },
      async (error) => {
        console.error('Error al eliminar la categoría de servicio:', error);
        this.translate.get('servicios.toast.Kategoria_Delete_E').subscribe((texto) => {
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
