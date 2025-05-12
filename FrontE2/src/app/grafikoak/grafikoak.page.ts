import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../components/header/header.component';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../zerbitzuak/login-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { ModoOscuroService } from '../zerbitzuak/Iluna.service';

import { LanguageService } from '../zerbitzuak/language.service';

declare var Chart: any; 
declare var html2canvas: any; // Declaramos que `html2canvas` existe globalmente

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
  isIkasle!:boolean;
  langileSelec!:any;
  private routeSubscription: any;
  modoOscuro: Boolean = false;

  ngOnDestroy() {
    // Limpiar la suscripción cuando el componente se destruya
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  constructor(
    private translate: TranslateService, 
    private http: HttpClient, private loginService: LoginServiceService, 
    private router: Router, 
    private route: ActivatedRoute,
    private modoOscuroService: ModoOscuroService,
    private languageService: LanguageService
  ) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
    this.selectedLanguage = this.languageService.getLanguage();
  }

  descargarGrafico() {
    const canvasElement = document.getElementById('myChart') as HTMLCanvasElement;
  
    if (!canvasElement) {
      console.error('No se encontró el canvas para generar la imagen');
      return;
    }
  
    // 🔍 Convertir el canvas a una imagen en formato PNG
    const imgData = canvasElement.toDataURL('image/png');
  
    // 🔍 Crear un documento PDF con jsPDF
    const pdf = new jsPDF();
    const margenIzquierdo = 10;
    let posicionY = 20;
  
    // 🔍 Cargar las imágenes de los logos
    const logoPeluqueria = new Image();
    logoPeluqueria.src = 'assets/IMP_Logotipoa.png'; // Ruta local del logo (Asegúrate de tenerlo en assets)
    const logoSanturtzi = new Image();
    logoSanturtzi.src = 'assets/images-removebg-preview.png'; // Ruta local del logo (Asegúrate de tenerlo en assets)
  
    // 🔍 Dibujar los logos cuando se cargan
    logoPeluqueria.onload = () => {
      pdf.addImage(logoPeluqueria, 'PNG', 10, 10, 40, 30); // Aumenté la anchura a 50 y mantuve la altura en 30
      logoSanturtzi.onload = () => {
        pdf.addImage(logoSanturtzi, 'PNG', 170, 10, 25, 25);
  
        // 🔹 Título del análisis
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("Análisis de Servicios", 75, 35);
  
        // 🔹 Línea divisoria
        pdf.setDrawColor(0, 102, 204);
        pdf.setLineWidth(0.5);
        pdf.line(10, 50, 200, 50);
  
        // 🔹 Información del trabajador
        posicionY = 60;
        const trabajador = this.langileSelec;
        const trabajadorNombre = trabajador ? trabajador.izena : "Desconocido";
        const trabajadorApellido = trabajador ? trabajador.abizenak : "";
        const grupoCodigo = trabajador ? trabajador.taldeKodea : "Sin código";
  
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Nombre: ${trabajadorNombre} ${trabajadorApellido}`, margenIzquierdo, posicionY);
        posicionY += 7;
        pdf.text(`Grupo: ${grupoCodigo}`, margenIzquierdo, posicionY);
  
        // 🔹 Línea divisoria
        posicionY += 10;
        pdf.setDrawColor(0, 102, 204);
        pdf.line(10, posicionY, 200, posicionY);
        posicionY += 5;
  
        // 🔹 Imagen del gráfico
        pdf.addImage(imgData, 'PNG', 15, posicionY, 180, 100);
  
        // 🔹 Pie de página (opcional, puedes eliminarlo si no te interesa)
        posicionY = 200;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100);
        pdf.text("LHFP Santurtzi - Departamento de Peluquería", margenIzquierdo, posicionY + 10);
        pdf.text("Teléfono: 94 493 12 34 - Email: info@lhfpsanturtzi.eus", margenIzquierdo, posicionY + 15);
  
        // 🔹 Descargar el PDF
        pdf.save(`grafico_${trabajadorNombre}.pdf`);
      };
    };
  }
  

  openGraphModal(langile: any) {
    this.isGraphOpen = true;
    this.langileSelec = langile;
    setTimeout(() => {
      this.mostrarDatos(langile.id); // Esperamos un poco antes de crear el gráfico
    }, 300); 
  }
  
  
  closeGraphModal(){
    this.isGraphOpen = false;
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    this.languageService.setLanguage(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  ngOnInit() {
    // Suscribirse a los cambios de ruta
    this.routeSubscription = this.route.params.subscribe((params) => {
      console.log('Ruta cambiada:', params); // Aquí puedes ver los cambios de parámetros

      // Comprobar si el usuario es 'Ikasle' cada vez que se carga la página
      this.isIkasle = this.loginService.isAlumno();
      
      // Si es Ikasle, redirigir a '/home'
      if (this.isIkasle) {
        this.router.navigate(['/home']);
      }

      // Llamar a las funciones necesarias
      this.langileakLortu();
      this.langile_serviceLortu();
    });

    this.cargarModoPreferido();
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
      let servicios = {};
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
  
  
  

  langile_serviceLortu() {
    this.http.get(`${environment.url}hitzorduak/langileZerbitzuak`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe(
      (datuak: any) => {
        // Transformamos los datos de la API en un formato más usable
        this.langileService = Object.entries(datuak).map(([key, value]: [string, any]) => ({
          id: key,
          nombre: value.nombre,
          servicios: value.servicios
        }));

        console.log('Langile Zerbitzuak kargatu:', this.langileService);
      },
      (error) => {
        console.error("Errorea langile zerbitzuak kargatzerakoan:", error);
      }
    );
  }

  langileakLortu() {
    this.http.get(`${environment.url}taldeak`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe(
      (datuak: any) => {
        // Filtramos las categorías y productos activos (sin `ezabatzeData`)
        this.langileak = datuak
          .filter((taldea: any) => taldea.ezabatzeData === null)
          .map((taldea: any) => ({
            ...taldea,
            langileak: taldea.langileak.filter((langile: any) => langile.ezabatzeData === null)
          }));

        console.log('Langileak kargatu:', this.langileak);
      },
      (error) => {
        console.error("Errorea langileak kargatzerakoan:", error);
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


