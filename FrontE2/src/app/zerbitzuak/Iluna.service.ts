import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModoOscuroService {

  private readonly storageKey = 'modoOscuro'; 

  constructor() {}

  getModoOscuro(): Boolean {
    const modoOscuro = localStorage.getItem(this.storageKey);
    return modoOscuro === 'true';  
  }

  setModoOscuro(modoOscuro: Boolean): void {
    localStorage.setItem(this.storageKey, String(modoOscuro)); 
  }
}
