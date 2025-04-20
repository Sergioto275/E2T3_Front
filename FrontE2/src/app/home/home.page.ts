import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginServiceService } from '../zerbitzuak/login-service.service';
import { TranslateService } from '@ngx-translate/core';
import { ModoOscuroService } from '../zerbitzuak/Iluna.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  ikasle!: boolean;
  selectedLanguage: string = 'es';
  modoOscuro: Boolean = false;

  constructor(
    private loginService: LoginServiceService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private modoOscuroService: ModoOscuroService
  ) {}

  ngOnInit() {
    // Cada vez que se navegue a esta página, este código se ejecutará
    console.log('Página Home cargada');
    this.ikasle = this.loginService.isAlumno();
    this.translate.setDefaultLang(this.selectedLanguage);

    // Escucha los cambios en la ruta
    this.route.params.subscribe(params => {
      // Puedes realizar una acción aquí cada vez que se cambie la ruta
      console.log('Ruta cambiada:', params);
      this.ikasle = this.loginService.isAlumno();
    });
    this.cargarModoPreferido();
  }

  logout() {
    this.loginService.logout();
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }
  // Cargar el modo preferido desde el servicio
  cargarModoPreferido() {
    this.modoOscuro = this.modoOscuroService.getModoOscuro();
    if (this.modoOscuro) {
      this.activarModoOscuro();
    }
  }

  // Activar el modo oscuro en el body y el ion-content
  activarModoOscuro() {
    document.body.classList.add('dark');
    const ionContent = document.querySelector('ion-content');
    if (ionContent) {
      ionContent.classList.add('dark'); // Aplicar el estilo oscuro en el ion-content
    }
  }

  // Desactivar el modo oscuro en el body y el ion-content
  desactivarModoOscuro() {
    document.body.classList.remove('dark');
    const ionContent = document.querySelector('ion-content');
    if (ionContent) {
      ionContent.classList.remove('dark'); // Eliminar el estilo oscuro en el ion-content
    }
  }

  // Cambiar el modo oscuro
  ponerModoOscuro() {
    this.modoOscuro = !this.modoOscuro;
    if (this.modoOscuro) {
      this.activarModoOscuro();
    } else {
      this.desactivarModoOscuro();
    }
    this.modoOscuroService.setModoOscuro(this.modoOscuro);  // Guarda el estado en localStorage
  }
}
