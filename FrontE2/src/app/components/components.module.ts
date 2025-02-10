import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { HomeBotoiakKonponenteaComponent } from './home-botoiak-konponentea/home-botoiak-konponentea.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [HeaderComponent, HomeBotoiakKonponenteaComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
  ],
  exports: [HeaderComponent, HomeBotoiakKonponenteaComponent]
})
export class ComponentsModule { }
