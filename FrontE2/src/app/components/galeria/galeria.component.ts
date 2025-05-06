import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
register();

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
})
export class GaleriaComponent {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined
  swiper?:Swiper
  
  @Input() imagenes: { url: string, data: string }[] = [];

  constructor(private modalController: ModalController) {}

  transformarURL(url:any): string {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? `https://drive.google.com/thumbnail?id=${match[1]}` : url;
  }

  swiperReady(){
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  swiperSlideChanged(e:any)
  {
    console.log("changed" , e)
  }

  cerrar() {
    this.modalController.dismiss();
  }
}
