import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TxostenaPageRoutingModule } from './txostena-routing.module';

import { TxostenaPage } from './txostena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TxostenaPageRoutingModule
  ],
  declarations: [TxostenaPage]
})
export class TxostenaPageModule {}
