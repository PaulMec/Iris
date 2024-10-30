import { TodoService } from './../../todo.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  imports: [CommonModule, FormsModule], // Agregamos CommonModule y FormsModule para *ngIf, *ngFor y ngModel
  providers: [TitleCasePipe] // Añadimos TitleCasePipe si es necesario
})
export class TodoComponent implements OnInit {
  todos: any[] = [];
  filteredTodos: any[] = [];
  newTodoTitle: string = '';
  filterStatus: string = 'all';
  isLoading: boolean = false; // Define isLoading si aún no estaba definida

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(): void {
    this.isLoading = true;
    this.todoService.getTodos().subscribe({
      next: (data) => {
        this.todos = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener las tareas:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    switch (this.filterStatus) {
      case 'completed':
        this.filteredTodos = this.todos.filter(todo => todo.completed);
        break;
      case 'pending':
        this.filteredTodos = this.todos.filter(todo => !todo.completed);
        break;
      default:
        this.filteredTodos = this.todos;
        break;
    }
  }


  onFilterChange(filter: string): void {
    this.filterStatus = filter;
    this.applyFilter();
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo = { title: this.newTodoTitle, description: '', status: 'pendiente' };
      this.todoService.addTodo(newTodo).subscribe({
        next: (todo) => {
          this.todos.push(todo);
          this.newTodoTitle = '';
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error al agregar tarea:', error);
        }
      });
    }
  }

  toggleTodoStatus(todo: any): void {
    const updates = {
      completed: !todo.completed,
      status: todo.completed ? 'pendiente' : 'completada'
    };

    this.todoService.updateTodo(todo._id, updates).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex(t => t._id === todo._id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
          this.applyFilter();
        }
      },
      error: (error) => {
        console.error('Error al actualizar tarea:', error);
      }
    });
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo._id !== id);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error al eliminar tarea:', error);
      }
    });
  }
}
