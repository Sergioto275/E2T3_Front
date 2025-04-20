import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModoOscuroService {

  private readonly storageKey = 'modoOscuro';  // Clave para guardar en localStorage

  constructor() {}

  // Método para obtener el estado del modo oscuro desde localStorage
  getModoOscuro(): Boolean {
    const modoOscuro = localStorage.getItem(this.storageKey);
    return modoOscuro === 'true';  // Devuelve 'true' si el valor en localStorage es 'true'
  }

  // Método para guardar el estado del modo oscuro en localStorage
  setModoOscuro(modoOscuro: Boolean): void {
    localStorage.setItem(this.storageKey, String(modoOscuro));  // Guarda el valor como string
  }
}
