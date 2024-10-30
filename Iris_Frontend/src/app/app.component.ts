import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  [x: string]: any;
  todos: any[] = [];
  filteredTodos: any[] = [];
  newTodoTitle: string = '';
  isLoading: boolean = false;
  filterStatus: string = 'all';
  title: string = 'Iris-Frontend';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodos();
  }

  // Método para obtener todas las tareas
  getTodos(): void {
    this.isLoading = true;
    this.todoService.getTodos().subscribe({
      next: (data) => {
        console.log('Tareas recibidas:', data);
        this.todos = data;
        this.applyFilter(); // Aplica el filtro para inicializar las tareas mostradas
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener las tareas:', error);
        this.isLoading = false;
      }
    });
  }

  // Método para agregar una nueva tarea
  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo = { title: this.newTodoTitle, description: '', status: 'pendiente', completed: false };
      this.todoService.addTodo(newTodo).subscribe({
        next: (todo) => {
          console.log('Tarea agregada:', todo);
          this.todos.push(todo);
          this.applyFilter(); // Actualiza el filtro después de agregar una tarea
          this.newTodoTitle = '';
        },
        error: (error) => {
          console.error('Error al agregar tarea:', error);
        }
      });
    }
  }

  // Método para actualizar el estado de la tarea
  toggleTodoStatus(todo: any): void {
    // Cambia el estado antes de enviar la solicitud, para una actualización de UI más rápida
    todo.completed = !todo.completed;
    todo.status = todo.completed ? 'completada' : 'pendiente';

    // Envía la solicitud al servidor
    this.todoService.updateTodo(todo._id, { completed: todo.completed, status: todo.status }).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex(t => t._id === todo._id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
        // Aplicar el filtro después de actualizar el estado
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error al actualizar tarea:', error);
        // Si hay un error, revertir los cambios
        todo.completed = !todo.completed;
        todo.status = !todo.completed ? 'completada' : 'pendiente';
      }
    });
  }

  // Método para eliminar una tarea
  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        console.log('Tarea eliminada:', id);
        this.todos = this.todos.filter(todo => todo._id !== id);
        this.applyFilter(); // Aplica el filtro después de eliminar una tarea
      },
      error: (error) => {
        console.error('Error al eliminar tarea:', error);
      }
    });
  }

  // Método para aplicar el filtro según el estado
  applyFilter(): void {
    if (this.filterStatus === 'all') {
      this.filteredTodos = this.todos;
    } else if (this.filterStatus === 'completed') {
      this.filteredTodos = this.todos.filter(todo => todo.completed);
    } else if (this.filterStatus === 'pending') {
      this.filteredTodos = this.todos.filter(todo => !todo.completed);
    }
  }

  // Método para manejar cambios en el filtro
  onFilterChange(): void {
    this.applyFilter();
  }
}
