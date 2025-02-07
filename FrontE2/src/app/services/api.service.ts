import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://localhost:8080/api'; // Ajusta la URL de la API

  constructor(private http: HttpClient) {}

  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hitzorduak`);
  }

  getTintes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tintes`);
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bezeroak`);
  }
}