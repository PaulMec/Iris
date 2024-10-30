import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  // Redirigir al To Do después del login exitoso
  handleSuccessfulLogin(response: any): void {
    localStorage.setItem('token', response.token);
    console.log('Login exitoso, token almacenado:', response.token);
    this.router.navigate(['/todos']); // Redirigir a la lista de tareas
  }
}
