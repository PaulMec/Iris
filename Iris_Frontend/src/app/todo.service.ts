import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'http://localhost:3000/todos';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  // Nuevo método para configurar el token manualmente, útil para pruebas unitarias
  setToken(newToken: string): void {
    this.token = newToken;
  }

  private getAuthHeaders(): HttpHeaders {
    // Usar el token proporcionado o buscar en localStorage
    const token = this.token || localStorage.getItem('token');
    console.log('Token encontrado:', token);
    if (!token) {
      throw new Error('Token no encontrado');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTodos(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al obtener tareas:', error);
        return throwError(error);
      })
    );
  }

  addTodo(todo: any): Observable<any> {
    return this.http.post(this.baseUrl, todo, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al agregar tarea:', error);
        return throwError(error);
      })
    );
  }

  updateTodo(id: string, updates: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updates, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al actualizar tarea:', error);
        return throwError(error);
      })
    );
  }

  deleteTodo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al eliminar tarea:', error);
        return throwError(error);
      })
    );
  }
}
