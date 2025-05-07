import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { LoginServiceService } from './zerbitzuak/login-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages: Array<{ 
    title: string; 
    url: string; 
    icon: string;
    translationKey: string;
  }> = [];

  private userSub: Subscription;

  constructor(
    private router: Router,
    private loginService: LoginServiceService
  ) {
    // Escuchar cambios en el usuario
    this.userSub = this.loginService.userChanged.subscribe(role => {
      this.generateMenuFromRoutes();
    });
  }

  ngOnInit() {
    this.generateMenuFromRoutes();
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  private generateMenuFromRoutes() {
    const routes: Routes = this.router.config;
    const currentRole = this.loginService.getCurrentRole();
    
    const menuRoutes = routes.filter(
      (route) => route.path && !route.path.includes('*') && route.path !== '' && route.path !== 'login'
    );

    this.appPages = menuRoutes
      .map((route) => ({
        title: this.getTitleFromPath(route.path || ''),
        url: `/${route.path}`,
        icon: this.getIconFromPath(route.path || ''),
        translationKey: `menu.${route.path}`
      }))
      .filter(page => {
        const pageName = page.url.replace('/', '');
        
        if (!currentRole) {
          return false; 
        }
        
        if (currentRole?.toLowerCase() === 'ik') {
          return !['ikasleak', 'grafikoak','tratamenduak'].includes(pageName);
        }
        
        return true;
      });
  }

  private getTitleFromPath(path: string): string {
    const titles: Record<string, string> = {
      'hitzorduak': 'Citas',
      'grafikoak': 'Gráficos',
      'materialak': 'Materiales',
      'produktuak': 'Productos',
      'historiala': 'Historial',
      'ikasleak': 'Estudiantes',
      'zerbitzuak': 'Servicios',
      'txandak': 'Turnos',
      'inbentario': 'Inventario',
      'tratamenduak': 'Tratamientos'
    };
    return titles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  }

  private getIconFromPath(path: string): string {
    const icons: Record<string, string> = {
      'home': 'home',
      'login': 'person',
      'hitzorduak': 'list',
      'grafikoak': 'bar-chart',
      'materialak': 'folder',
      'produktuak': 'cart',
      'historiala': 'time',
      'ikasleak': 'people',
      'zerbitzuak': 'settings',
      'txandak': 'cash',
      'inbentario': 'archive',
      'parametrizacion': 'settings',
      'tratamenduak': 'checkmark',
    };
    return icons[path] || 'help';
  }
}