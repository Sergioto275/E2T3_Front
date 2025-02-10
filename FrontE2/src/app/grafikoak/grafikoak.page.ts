import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../components/header/header.component';

declare var Chart: any; 

@Component({
  selector: 'app-grafikoak',
  templateUrl: './grafikoak.page.html',
  styleUrls: ['./grafikoak.page.scss'],
})
export class GrafikoakPage implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  langileak:any[] = [];
  chart: any;
  categoriasAbiertas: { [key: string]: boolean } = {};
  langileService:any[]=[];
  isGraphOpen:boolean = false;
  selectedLanguage: string = 'es'; 

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  }

  openGraphModal(id: string) {
    this.isGraphOpen = true;
    setTimeout(() => {
      this.mostrarDatos(id); // Esperamos un poco antes de crear el gráfico
    }, 300); 
  }
  
  
  closeGraphModal(){
    this.isGraphOpen = false;
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  ngOnInit() {
    this.langileakLortu();
    this.langile_serviceLortu();
  }

  toggleCategoria(categoria: string) {
    this.categoriasAbiertas[categoria] = !this.categoriasAbiertas[categoria];
  }

  isCategoriaAbierta(categoria: string): boolean {
    return this.categoriasAbiertas[categoria] || false;
  }

  mostrarDatos(trabajadorId: string) {
    setTimeout(() => {
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      if (!ctx) {
        console.error('No se encontró el canvas');
        return;
      }
  
      if (this.chart) {
        this.chart.destroy(); // Destruir gráfico anterior si existe
      }
  
      const trabajador = this.langileService.find(t => t.id == trabajadorId);
      let servicios = { corte: 0, tinte: 0 };
      let trabajadorNombre = trabajador ? trabajador.nombre : "Desconocido";
  
      if (trabajador) {
        servicios = trabajador.servicios;
      }
  
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(servicios),
          datasets: [{
            label: `${trabajadorNombre} - Servicios`,
            data: Object.values(servicios),
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }, 500);
  }
  
  
  

  async langile_serviceLortu() {
    try {
      const response = await fetch(`${environment.url}hitzorduak/langileZerbitzuak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
  
      const datuak = await response.json();
  
      // Transformamos los datos de la API en un formato más usable
      this.langileService = Object.entries(datuak).map(([key, value]: [string, any]) => ({
        id: key,
        nombre: value.nombre,
        servicios: value.servicios
      }));
  
      console.log('Langile Zerbitzuak kargatu:', this.langileService);
    } catch (e) {
      console.error("Errorea langile zerbitzuak kargatzerakoan:", e);
    }
  }  

  async langileakLortu() {
    try {
      const response = await fetch(`${environment.url}taldeak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
  
      const datuak = await response.json();
      
      // Filtramos las categorías y productos activos (sin `ezabatzeData`)
      this.langileak = datuak
        .filter((taldea:any) => taldea.ezabatzeData === null)
        .map((taldea:any) => ({
          ...taldea,
          langileak: taldea.langileak.filter((langile:any) => langile.ezabatzeData === null)}));
  
      console.log('Produktuak kargatu:', this.langileak);
  
    } catch (e) {
      console.error("Errorea produktuak kargatzerakoan:", e);
    }
  }
}


