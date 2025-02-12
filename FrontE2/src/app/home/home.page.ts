import { Component } from '@angular/core';
import { LoginServiceService } from '../zerbitzuak/login-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ikasle!:boolean;
  selectedLanguage: string = 'es';

  constructor(private loginService: LoginServiceService, private translate: TranslateService) {}

  logout(){
    this.loginService.logout();
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  ngOnInit()
  {
    this.ikasle = this.loginService.isAlumno();
    this.translate.setDefaultLang(this.selectedLanguage);
  }
}
