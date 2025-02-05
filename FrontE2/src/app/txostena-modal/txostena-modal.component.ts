import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-txostena-modal',
  templateUrl: './txostena-modal.component.html',
  styleUrls: ['./txostena-modal.component.scss'],
})

export class TxostenaModalComponent implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  
  idCliente!: number;
  nombre!: string;
  apellido!: string;
  tlf!: string;
  tinte!: number;
  pSensible!: boolean;
  selectedLanguage: string = 'es';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  ngOnInit() {
    this.idCliente = Math.floor(Math.random() * 9000) + 1000;
    const nombres = ['Juan', 'Ana', 'Pedro', 'Maria', 'Carlos', 'Laura', 'José', 'Lucía'];
    const apellidos = ['Pérez', 'González', 'Martínez', 'Rodríguez', 'López', 'Sánchez'];

    this.nombre = nombres[Math.floor(Math.random() * nombres.length)];
    this.apellido = apellidos[Math.floor(Math.random() * apellidos.length)];

    this.tlf = this.tlfAleatorio();
    this.tinte =this.tinteAleatorio();
    this.pSensible = Math.random() < 0.5; 
  }

  tlfAleatorio(): string {
    // El primer dígito será 6 o 7
    const primerDigito = Math.random() < 0.5 ? '6' : '7';
    let telefono = primerDigito;

    for (let i = 0; i < 8; i++) {
      telefono += Math.floor(Math.random() * 10).toString();
    }
    return telefono;
  }
  tinteAleatorio(): number {
    const tinte = Math.random() * 9 + 1;
    return Math.round(tinte * 10) / 10; 
  }

  dismiss() {
    console.log("Cerrando el modal...");
  }
}