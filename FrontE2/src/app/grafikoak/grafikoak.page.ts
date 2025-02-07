import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-grafikoak',
  templateUrl: './grafikoak.page.html',
  styleUrls: ['./grafikoak.page.scss'],
})
export class GrafikoakPage implements OnInit, AfterViewInit {
  
  @ViewChild('citasChart', { static: false }) citasChart!: ElementRef;
  @ViewChild('tintesChart', { static: false }) tintesChart!: ElementRef;
  @ViewChild('clientesChart', { static: false }) clientesChart!: ElementRef;

  graficos = [
    { nombre: 'CITAS' },
    { nombre: 'TINTES' },
    { nombre: 'CLIENTES' }
  ];

  showCitas = false;
  showTintes = false;
  showClientes = false;

  citasData: number[] = [];
  tintesData: number[] = [];
  clientesData: number[] = [];

  private citasChartInstance: Chart | null = null;
  private tintesChartInstance: Chart | null = null;
  private clientesChartInstance: Chart | null = null;
  
  searchText: string = '';
  selectedLanguage: string = 'es';

  constructor(private apiService: ApiService, private translate: TranslateService) {
    // Recuperamos el idioma guardado o establecemos por defecto 'es'
    this.selectedLanguage = localStorage.getItem('language') || 'es';
    this.translate.setDefaultLang(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.showCitas) this.renderBarChart();
      if (this.showTintes) this.renderLineChart();
      if (this.showClientes) this.renderPieChart();
    }, 500);
  }

  graficosFiltrados() {
    return this.searchText
      ? this.graficos.filter(grafico =>
          this.translate.instant(grafico.nombre).toLowerCase().includes(this.searchText.toLowerCase())
        )
      : this.graficos;
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    localStorage.setItem('language', this.selectedLanguage);
  }

  loadData() {
    this.apiService.getCitas().subscribe((data: any[]) => {
      this.citasData = data.map(item => item.cantidad);
    });

    this.apiService.getTintes().subscribe((data: any[]) => {
      this.tintesData = data.map(item => item.cantidad);
    });

    this.apiService.getClientes().subscribe((data: any[]) => {
      this.clientesData = data.map(item => item.cantidad);
    });
  }

  toggleGraph(type: string) {
    if (type === 'citas') {
      this.showCitas = !this.showCitas;
      if (this.showCitas) {
        setTimeout(() => this.renderBarChart(), 500);
      } else {
        this.destroyChart(this.citasChartInstance);
      }
    } else if (type === 'tintes') {
      this.showTintes = !this.showTintes;
      if (this.showTintes) {
        setTimeout(() => this.renderLineChart(), 500);
      } else {
        this.destroyChart(this.tintesChartInstance);
      }
    } else if (type === 'clientes') {
      this.showClientes = !this.showClientes;
      if (this.showClientes) {
        setTimeout(() => this.renderPieChart(), 500);
      } else {
        this.destroyChart(this.clientesChartInstance);
      }
    }
  }

  renderBarChart() {
    this.destroyChart(this.citasChartInstance);
    this.citasChartInstance = new Chart(this.citasChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.getMonthLabels(),
        datasets: [{
          label: this.translate.instant('CITAS_POR_MES'),
          data: this.citasData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  renderLineChart() {
    this.destroyChart(this.tintesChartInstance);
    this.tintesChartInstance = new Chart(this.tintesChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.getMonthLabels(),
        datasets: [{
          label: this.translate.instant('TINTES_APLICADOS'),
          data: this.tintesData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  renderPieChart() {
    this.destroyChart(this.clientesChartInstance);
    this.clientesChartInstance = new Chart(this.clientesChart.nativeElement, {
      type: 'pie',
      data: {
        labels: [
          this.translate.instant('CLIENTES_CENTRO'),
          this.translate.instant('CLIENTES_EXTERIOR')
        ],
        datasets: [{
          label: this.translate.instant('DISTRIBUCION_CLIENTES'),
          data: this.clientesData,
          backgroundColor: ['#ff6384', '#36a2eb']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  getMonthLabels(): string[] {
    return [
      this.translate.instant('SEPTIEMBRE'),
      this.translate.instant('OCTUBRE'),
      this.translate.instant('NOVIEMBRE'),
      this.translate.instant('DICIEMBRE'),
      this.translate.instant('ENERO'),
      this.translate.instant('FEBRERO'),
      this.translate.instant('MARZO'),
      this.translate.instant('ABRIL'),
      this.translate.instant('MAYO'),
      this.translate.instant('JUNIO')
    ];
  }

  private destroyChart(chartInstance: Chart | null) {
    if (chartInstance) {
      chartInstance.destroy();
    }
  }
}
