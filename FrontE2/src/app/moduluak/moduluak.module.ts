import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeBotoiakKonponenteaComponent } from './home-botoiak-konponentea/home-botoiak-konponentea.component';



@NgModule({
  declarations: [HomeBotoiakKonponenteaComponent],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [HomeBotoiakKonponenteaComponent]
})
export class ModuluakModule { }
