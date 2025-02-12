import { Component } from '@angular/core';
import { LoginServiceService } from '../zerbitzuak/login-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ikasle!:boolean;

  constructor(private loginService: LoginServiceService) {}

  ngOnInit()
  {
    this.ikasle = this.loginService.isAlumno();
  }
}
