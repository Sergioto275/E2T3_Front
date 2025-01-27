import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast-mezua',
  templateUrl: './toast-mezua.component.html',
  styleUrls: ['./toast-mezua.component.scss'],
})
export class ToastMezuaComponent  implements OnInit {
  mezua!:string
  public toastButtons = [
    {
      text: 'Dismiss',
      role: 'cancel',
    },
  ];
  constructor() { }

  ngOnInit() {}

}
