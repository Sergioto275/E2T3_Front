import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { HomeBotoiakKonponenteaComponent } from './home-botoiak-konponentea/home-botoiak-konponentea.component';
import { RouterModule } from '@angular/router';
import { ToastMezuaComponent } from './toast-mezua/toast-mezua.component';



@NgModule({
  declarations: [HeaderComponent, HomeBotoiakKonponenteaComponent, ToastMezuaComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [HeaderComponent, HomeBotoiakKonponenteaComponent, ToastMezuaComponent]
})
export class ComponentsModule { }
