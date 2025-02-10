import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TxostenaModalComponent } from '../txostena-modal/txostena-modal.component'; // Asegúrate de importar correctamente el componente del modal
import { HeaderComponent } from '../components/header/header.component';

interface Txostena {
  name: string;
  image: string;
  number: string;
  buttonColor: string;
}

@Component({
  selector: 'app-txostena',
  templateUrl: './txostena.page.html',
  styleUrls: ['./txostena.page.scss'],
  standalone:false,
})
export class TxostenaPage implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  txostenak: Txostena[] = [
    { name: '', image: 'https://picsum.photos/50/50?random=1', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=2', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=3', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=4', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=5', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=6', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=7', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=8', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=9', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=10', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=11', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=12', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=13', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=14', number: '', buttonColor: '' },
    { name: '', image: 'https://picsum.photos/50/50?random=15', number: '', buttonColor: '' }
  ];

  selectedLanguage: string = 'es'; // Idioma seleccionado
  buttonColors = ['warning', 'success', 'danger']; // Colores de botones disponibles

  constructor(
    private translate: TranslateService,
    private modalController: ModalController // Inyecta el ModalController
  ) {}

  ngOnInit() {
    this.txostenak = this.txostenak.map((txostena, index) => ({
      ...txostena,
      number: this.getRandomNumber(),
      buttonColor: this.getRandomButtonColor(),
      name: this.translate.instant('Cliente ') + (index + 1)
    }));

    // Configuración inicial del idioma
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  }

  async openModal(txostena: Txostena) {
    const modal = await this.modalController.create({
      component: TxostenaModalComponent, // El componente del modal
      componentProps: { txostena: txostena } // Pasa los datos de txostena al modal
    });
    return await modal.present();
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    this.txostenak = this.txostenak.map((txostena, index) => ({
      ...txostena,
      name: this.translate.instant('Bezero ') + (index + 1)
    }));
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  getRandomNumber(): string {
    const num = Math.floor(Math.random() * 200) + 1;
    return num > 99 ? '+99' : num.toString();
  }

  getRandomButtonColor(): string {
    const randomIndex = Math.floor(Math.random() * this.buttonColors.length);
    return this.buttonColors[randomIndex];
  }
}
