import { Component, OnInit } from '@angular/core';

export interface Ikaslea {
  id: number;
  nombre: string;
  kodea: string;
  abizenak: string;
  sortzeData: Date;
  eguneratzeData: Date;
  ezabatzeData: Date;
}

@Component({
  selector: 'app-ikasleak',
  templateUrl: './ikasleak.page.html',
  styleUrls: ['./ikasleak.page.scss'],
  standalone: false,
})
export class IkasleakPage implements OnInit {
  alumnos: Ikaslea[] = [
    {
      id: 1,
      nombre: 'Julio',
      kodea: '12a',
      abizenak: 'Lopez',
      sortzeData: new Date('2025-01-13'),
      eguneratzeData: new Date(),
      ezabatzeData: new Date(),
    },
  ];

  constructor() {}

  ngOnInit() {}
}
