import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginServiceService } from '../zerbitzuak/login-service.service';
import { TranslateService } from '@ngx-translate/core';
import { ModoOscuroService } from '../zerbitzuak/Iluna.service';

import { LanguageService } from '../zerbitzuak/language.service';

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
    private modoOscuroService: ModoOscuroService,
    private languageService: LanguageService
  ) {}

  

  ngOnInit() {
    this.actualizarEstadoAlumno(); 
    this.translate.setDefaultLang(this.selectedLanguage);
  
    this.route.params.subscribe(() => {
      this.actualizarEstadoAlumno();
    });
    this.cargarModoPreferido();
  }
  
  actualizarEstadoAlumno() {
    this.ikasle = this.loginService.isAlumno();
  }
  
  logout() {
    this.loginService.logout();
  }

  changeLanguage() {
    this.languageService.setLanguage(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
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
