import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../zerbitzuak/login-service.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  submitted: boolean = false;
  loginMessage: string = ''; // Para mostrar el mensaje de validación
  loginMessageType: 'success' | 'error' = 'error'; // Para controlar el tipo de mensaje (exito o error)

  constructor(private router: Router, private loginService: LoginServiceService) {}

  ngOnInit() {}

  async onLogin() {
    this.submitted = true;

    // Validar si los campos están vacíos
    if (!this.username || !this.password) {
      this.loginMessage = 'Por favor, ingresa usuario y contraseña.';
      this.loginMessageType = 'error';
      return;
    }

    try {
      const success = await firstValueFrom(this.loginService.login(this.username, this.password));

      if (success) {
        this.loginMessage = 'Inicio de sesión exitoso.';
        this.loginMessageType = 'success';
        this.router.navigate(['/home']);
      } else {
        this.loginMessage = 'Usuario o contraseña incorrectos';
        this.loginMessageType = 'error';
      }
    } catch (error) {
      console.error("Error en el proceso de login:", error);
      this.loginMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
      this.loginMessageType = 'error';
    }
  }
}
