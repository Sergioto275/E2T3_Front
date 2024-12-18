import { Component } from '@angular/core';

interface Txostena {
  name: string;
  image: string;
  number: string;        // Número aleatorio (puede ser '+99' o un valor numérico)
  buttonColor: string;   // Color del botón ('warning', 'success', 'danger')
}



@Component({
  selector: 'app-txostena',
  templateUrl: './txostena.page.html',
  styleUrls: ['./txostena.page.scss'],
})


export class TxostenaPage {
  // Declarar el array con el tipo Txostena
  txostenak: Txostena[] = [
    { name: 'Txostena 1', image: 'https://picsum.photos/50/50?random=1', number: '', buttonColor: '' },
    { name: 'Txostena 2', image: 'https://picsum.photos/50/50?random=2', number: '', buttonColor: '' },
    { name: 'Txostena 3', image: 'https://picsum.photos/50/50?random=3', number: '', buttonColor: '' },
    { name: 'Txostena 4', image: 'https://picsum.photos/50/50?random=4', number: '', buttonColor: '' },
    { name: 'Txostena 5', image: 'https://picsum.photos/50/50?random=5', number: '', buttonColor: '' },
    { name: 'Txostena 6', image: 'https://picsum.photos/50/50?random=6', number: '', buttonColor: '' },
    { name: 'Txostena 7', image: 'https://picsum.photos/50/50?random=7', number: '', buttonColor: '' },
    { name: 'Txostena 8', image: 'https://picsum.photos/50/50?random=8', number: '', buttonColor: '' },
    { name: 'Txostena 9', image: 'https://picsum.photos/50/50?random=9', number: '', buttonColor: '' },
    { name: 'Txostena 10', image: 'https://picsum.photos/50/50?random=10', number: '', buttonColor: '' },
    { name: 'Txostena 11', image: 'https://picsum.photos/50/50?random=11', number: '', buttonColor: '' },
    { name: 'Txostena 12', image: 'https://picsum.photos/50/50?random=12', number: '', buttonColor: '' },
    { name: 'Txostena 13', image: 'https://picsum.photos/50/50?random=13', number: '', buttonColor: '' },
    { name: 'Txostena 14', image: 'https://picsum.photos/50/50?random=14', number: '', buttonColor: '' },
    { name: 'Txostena 15', image: 'https://picsum.photos/50/50?random=15', number: '', buttonColor: '' },

  ];

  buttonColors = ['warning', 'success', 'danger']; // Colores disponibles

  constructor() {
    // Añadir números aleatorios y colores dinámicos a cada txostena
    this.txostenak = this.txostenak.map((txostena) => ({
      ...txostena,
      number: this.getRandomNumber(),
      buttonColor: this.getRandomButtonColor(),
    }));
  }

  // Generar un número aleatorio entre 1 y 200
  getRandomNumber(): string {
    const num = Math.floor(Math.random() * 200) + 1;
    return num > 99 ? '+99' : num.toString();
  }

  // Obtener un color aleatorio del arreglo
  getRandomButtonColor(): string {
    const randomIndex = Math.floor(Math.random() * this.buttonColors.length);
    return this.buttonColors[randomIndex];
  }
}
