import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TxandakPageRoutingModule } from './txandak-routing.module';

import { TxandakPage } from './txandak.page';
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TxandakPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule  
],
  declarations: [TxandakPage]
})
export class TxandakPageModule {}
