import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('language') || 'es';  // Cargar idioma guardado o 'es' por defecto
    console.log('Idioma seleccionado:', savedLanguage);  // Verificar el idioma
    this.translate.setDefaultLang(savedLanguage);  // Establecer el idioma predeterminado
    this.translate.use(savedLanguage);  // Usar el idioma guardado
  }
  
  // Método para cambiar el idioma y guardarlo
  changeLanguage(selectedLanguage: string) {
    this.translate.use(selectedLanguage);  // Cambiar idioma
    localStorage.setItem('language', selectedLanguage);  // Guardar idioma en localStorage
  }
}
