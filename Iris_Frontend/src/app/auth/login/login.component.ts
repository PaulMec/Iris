import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],  // Asegúrate de importar FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = 'yilver@eiris.com';
  password: string = '12345qwert';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.handleSuccessfulLogin(response);
        console.log('Login exitoso, token almacenado:', response.token);
        this.router.navigate(['/todos']); // Redirige a la vista del "To Do List" después del login exitoso
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
      }
    });
  }
}
