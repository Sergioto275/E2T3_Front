import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IkasleakPageRoutingModule } from './ikasleak-routing.module';

import { IkasleakPage } from './ikasleak.page';
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IkasleakPageRoutingModule,
    ComponentsModule
],
  declarations: [IkasleakPage]
})
export class IkasleakPageModule {}
