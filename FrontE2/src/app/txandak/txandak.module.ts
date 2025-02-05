import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TxandakPageRoutingModule } from './txandak-routing.module';

import { TxandakPage } from './txandak.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TxandakPageRoutingModule
  ],
  declarations: [TxandakPage]
})
export class TxandakPageModule {}
