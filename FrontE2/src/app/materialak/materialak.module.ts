import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialakPageRoutingModule } from './materialak-routing.module';

import { MaterialakPage } from './materialak.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialakPageRoutingModule
  ],
  declarations: [MaterialakPage]
})
export class MaterialakPageModule {}
