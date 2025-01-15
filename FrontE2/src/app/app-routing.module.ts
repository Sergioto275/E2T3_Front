import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'hitzorduak',
    loadChildren: () => import('./hitzorduak/hitzorduak.module').then( m => m.HitzorduakPageModule)
  },
  {
    path: 'produktuak',
    loadChildren: () => import('./produktuak/produktuak.module').then( m => m.ProduktuakPageModule)
  },
  {
    path: 'grafikoak',
    loadChildren: () => import('./grafikoak/grafikoak.module').then( m => m.GrafikoakPageModule)
  },  {
    path: 'ikasleak',
    loadChildren: () => import('./ikasleak/ikasleak.module').then( m => m.IkasleakPageModule)
  },
  {
    path: 'materialak',
    loadChildren: () => import('./materialak/materialak.module').then( m => m.MaterialakPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
