import { Component, OnInit } from '@angular/core';

export interface IBalioa {
  botoiTitulua: string;
  iconIzena: string;
}

@Component({
  selector: 'app-home-botoiak-konponentea',
  templateUrl: './home-botoiak-konponentea.component.html',
  styleUrls: ['./home-botoiak-konponentea.component.scss'],
})
export class HomeBotoiakKonponenteaComponent  implements OnInit {

  //HACERLO CON INPUT
  botoiLista: IBalioa[] = [
    {
      botoiTitulua: "Hitzorduak",
      iconIzena: "calendar-number",
    },
    {
      botoiTitulua: "Txostenak",
      iconIzena: "document-text",
    },
  ]

  constructor() { }

  ngOnInit() {}

}
