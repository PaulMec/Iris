import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { TodoComponent } from './todo/todo/todo.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'todos', component: TodoComponent, canActivate: [AuthGuard] }
];
