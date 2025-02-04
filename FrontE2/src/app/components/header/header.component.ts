import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  public appPages = [
    { title: 'Hitzorduak', url: '/hitzorduak', icon: 'calendar-number' },
    { title: 'Txostenak', url: '/txostenak', icon: 'document-text' },
    { title: 'Materialak', url: '/materialak', icon: 'cut' },
    { title: 'Produktuak', url: '/produktuak', icon: 'color-fill' },
    { title: 'Historiala', url: '/historiala', icon: 'albums' },
    { title: 'Ikasleak', url: '/ikasleak', icon: 'people' },
    { title: 'Zerbitzuak', url: '/tratamenduak', icon: 'cut' },
  ];

  constructor() { }

  ngOnInit() {}

}
