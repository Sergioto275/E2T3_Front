import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  public appPages: Array<{ 
    title: string; 
    url: string; 
    icon: string;
    translationKey: string; // Nueva propiedad para las claves de traducción
  }> = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateMenuFromRoutes();
  }

  private generateMenuFromRoutes() {
    const routes: Routes = this.router.config;
 
    const menuRoutes = routes.filter(
      (route) => route.path && !route.path.includes('*') && route.path !== ''
    );

    this.appPages = menuRoutes.map((route) => ({
      title: this.getTitleFromPath(route.path || ''),
      url: `/${route.path}`,
      icon: this.getIconFromPath(route.path || ''),
      translationKey: `menu.${route.path}` // Clave de traducción basada en la ruta
    }));
  }

  private getTitleFromPath(path: string): string {
    const titles: Record<string, string> = {
      // Puedes mantener esto como respaldo
    };
    return titles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  }

  private getIconFromPath(path: string): string {
    const icons: Record<string, string> = {
      'home': 'home',
      'login': 'person',
      'hitzorduak': 'list',
      'grafikoak': 'bar-chart',
      "materialak": "folder",
      "produktuak": "cart",
      "historiala": "time",
      "ikasleak": "people",
      "zerbitzuak": "settings",
      "txandak":"cash",
      "inbentario":"archive",
      "parametrizacion":"settings",
      "tratamenduak":"checkmark",
    };
    return icons[path] || 'help';
  }
}