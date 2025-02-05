import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InbentarioaPage } from './inbentarioa.page';

const routes: Routes = [
  {
    path: '',
    component: InbentarioaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InbentarioaPageRoutingModule {}
