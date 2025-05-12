// src/app/services/language.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang = 'es';

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('selectedLanguage');
    this.currentLang = savedLang ?? 'es';
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);
  }

  setLanguage(lang: string) {
    this.currentLang = lang;
    localStorage.setItem('selectedLanguage', lang);
    this.translate.use(lang);
  }

  getLanguage(): string {
    return this.currentLang;
  }
}
