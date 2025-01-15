import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HitzorduakPageRoutingModule } from './hitzorduak-routing.module';

import { HitzorduakPage } from './hitzorduak.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HitzorduakPageRoutingModule
  ],
  declarations: [HitzorduakPage]
})
export class HitzorduakPageModule {}
