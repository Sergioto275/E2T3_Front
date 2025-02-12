import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public appPages: any[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.loadTranslations();
  }

  public loadTranslations() {
    this.translate.get([
      'menu.home', 'menu.hitzorduak', 'menu.txandak','menu.grafikoak', 'menu.materialak', 
      'menu.produktuak', 'menu.historiala', 'menu.ikasleak', 'menu.zerbitzuak'
    ]).subscribe(translations => {
      this.appPages = [
        { title: translations['menu.home'], url: '/home', icon: 'home' },
        { title: translations['menu.hitzorduak'], url: '/hitzorduak', icon: 'calendar-number' },
        { title: translations['menu.txandak'], url: '/txandak', icon: 'repeat' },
        { title: translations['menu.materialak'], url: '/materialak', icon: 'cut' },
        { title: translations['menu.produktuak'], url: '/produktuak', icon: 'color-fill' },
        { title: translations['menu.zerbitzuak'], url: '/tratamenduak', icon: 'color-palette' },
        { title: translations['menu.ikasleak'], url: '/ikasleak', icon: 'people' },
        { title: translations['menu.historiala'], url: '/historiala', icon: 'document-text' },
        { title: translations['menu.grafikoak'], url: '/grafikoak', icon: 'stats-chart' },

      ];
    });
  }
  
}
