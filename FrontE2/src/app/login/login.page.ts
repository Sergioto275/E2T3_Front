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

  constructor(private router: Router, private loginService: LoginServiceService) {}

  ngOnInit() {}

  async onLogin() {
    try {
      if (!this.username || !this.password) {
        alert('Por favor, ingresa usuario y contraseña.');
        return;
      }
  
      const success = await firstValueFrom(this.loginService.login(this.username, this.password));
  
      if (success) {
        console.log("good");
        this.router.navigate(['/home']);
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error("Error en el proceso de login:", error);
      alert('Ocurrió un error inesperado. Inténtalo de nuevo.');
    }
  }
  
  
  
}
