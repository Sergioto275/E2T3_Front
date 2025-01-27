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
    { title: 'Inbentarioa', url: '/inbentarioa', icon: 'albums' },
    { title: 'Ikasleak', url: '/ikasleak', icon: 'people' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor() { }

  ngOnInit() {}

}
