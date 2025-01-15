import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrafikoakPageRoutingModule } from './grafikoak-routing.module';

import { GrafikoakPage } from './grafikoak.page';
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrafikoakPageRoutingModule,
    ComponentsModule
],
  declarations: [GrafikoakPage]
})
export class GrafikoakPageModule {}
