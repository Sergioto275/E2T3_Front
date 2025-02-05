import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InbentarioaPageRoutingModule } from './inbentarioa-routing.module';

import { InbentarioaPage } from './inbentarioa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InbentarioaPageRoutingModule
  ],
  declarations: [InbentarioaPage]
})
export class InbentarioaPageModule {}
