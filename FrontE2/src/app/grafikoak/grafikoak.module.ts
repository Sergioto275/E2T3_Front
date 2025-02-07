import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';  // Asegúrate de importar TranslateModule
import { IonicModule } from '@ionic/angular';

import { GrafikoakPageRoutingModule } from './grafikoak-routing.module';
import { GrafikoakPage } from './grafikoak.page';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    GrafikoakPageRoutingModule,  // ← AQUÍ FALTABA LA COMA
    HttpClientModule
  ],
  declarations: [GrafikoakPage]
})
export class GrafikoakPageModule {}
