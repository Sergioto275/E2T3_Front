import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TxostenaPage } from './txostena.page';

const routes: Routes = [
  {
    path: '',
    component: TxostenaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TxostenaPageRoutingModule {}
