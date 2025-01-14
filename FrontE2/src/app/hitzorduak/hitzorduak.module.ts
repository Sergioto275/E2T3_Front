import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HitzorduakPageRoutingModule } from './hitzorduak-routing.module';

import { HitzorduakPage } from './hitzorduak.page';
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HitzorduakPageRoutingModule,
    ComponentsModule
],
  declarations: [HitzorduakPage]
})
export class HitzorduakPageModule {}
