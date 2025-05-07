import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  user: any = null;
  userChanged: EventEmitter<string | null> = new EventEmitter(); 

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const json_data = { "username": username, "pasahitza": password };
    
    return this.http.post<any>(`${environment.url}erabiltzaileak/login`, json_data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => {
        if (response && response.status === true) {
          this.user = response;
          localStorage.setItem('username', response.username);
          localStorage.setItem('role', response.rola);
          this.userChanged.emit(response.rola);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error("Error en la petición de login:", error);
        return of(false);
      })
    );
  }
  
  logout() {
    this.user = null;
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.userChanged.emit(null); 
    this.router.navigate(['/login']);
  }
  
  getCurrentRole(): string | null {
    return localStorage.getItem('role');
  }

  isAlumno(): boolean {
    const role = localStorage.getItem('role');
    return role?.toLowerCase() === 'ik'; 
  }
}