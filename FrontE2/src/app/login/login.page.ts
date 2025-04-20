import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../zerbitzuak/login-service.service';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ModoOscuroService } from '../zerbitzuak/Iluna.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  submitted: boolean = false;
  loginMessage: string = '';
  loginMessageType: 'success' | 'error' = 'error';
  selectedLanguage: string = 'es';
  modoOscuro: Boolean = false;

  constructor(
    private router: Router, 
    private loginService: LoginServiceService, 
    private translate: TranslateService,
    private modoOscuroService: ModoOscuroService 
  ) {}

  ngOnInit() {
    this.translate.setDefaultLang(this.selectedLanguage);
    this.cargarModoPreferido();
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    this.changeLanguage();
    this.clearMessage(); // Limpia el mensaje al cambiar idioma
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  // Nuevo método para limpiar mensajes
  clearMessage() {
    this.loginMessage = '';
    this.loginMessageType = 'error';
    this.submitted = false;
  }

  async onLogin() {
    this.submitted = true;

    // Validar si los campos están vacíos
    if (!this.username || !this.password) {
      this.loginMessage = this.translate.instant('login.vacio');
      this.loginMessageType = 'error';
      return;
    }

    try {
      const success = await firstValueFrom(this.loginService.login(this.username, this.password));

      if (success) {
        this.loginMessage = this.translate.instant('login.messageOk');
        this.loginMessageType = 'success';
        this.router.navigate(['/home']);
      } else {
        this.loginMessage = this.translate.instant('login.messageFail');
        this.loginMessageType = 'error';
      }
    } catch (error) {
      console.error("Error en el proceso de login:", error);
      this.loginMessage = this.translate.instant('login.messageNotOk');
      this.loginMessageType = 'error';
    }
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