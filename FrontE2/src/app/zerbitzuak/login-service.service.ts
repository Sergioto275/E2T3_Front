import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private authState = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string | null>(null);

  constructor(private storage: Storage, private router: Router) {
    this.init();
  }

  async init() {
    await this.storage.create(); // Inicializar Storage
    const token = await this.storage.get('token');
    const role = await this.storage.get('role');
    if (token) {
      this.authState.next(true);
      this.userRole.next(role);
    }
  }

  async login(username: string, password: string) {
    // Simulación de autenticación (aquí harías una petición a tu backend)
    if (username === 'admin' && password === '1234') {
      const token = 'fake-jwt-token'; // Reemplázalo por un token real
      const role = 'admin'; // El backend debe devolver el rol

      await this.storage.set('token', token);
      await this.storage.set('role', role);
      this.authState.next(true);
      this.userRole.next(role);
      return true;
    } else if (username === 'user' && password === '1234') {
      const token = 'fake-jwt-token';
      const role = 'user';

      await this.storage.set('token', token);
      await this.storage.set('role', role);
      this.authState.next(true);
      this.userRole.next(role);
      return true;
    }

    return false;
  }

  async logout() {
    await this.storage.remove('token');
    await this.storage.remove('role');
    this.authState.next(false);
    this.userRole.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  async hasRole(role: string): Promise<boolean> {
    const currentRole = await this.storage.get('role');
    return currentRole === role;
  }
}
