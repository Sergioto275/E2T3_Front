import { Component, OnInit } from '@angular/core';
// import { IonButton, IonContent, IonHeader, IonLabel, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';


export interface Producto {
  nombre:string,
  precio:number,
  selected:boolean
}

export interface Alumno {
  nombre: string;
  grupo: string;
}

@Component({
  selector: 'app-produktuak',
  templateUrl: './produktuak.page.html',
  styleUrls: ['./produktuak.page.scss'],
  // imports: [IonButton, IonContent, IonHeader, IonLabel, IonModal, IonTitle, IonToolbar],
})
export class ProduktuakPage implements OnInit {

  produktuak!:any[];

  productosSeleccionados:any[]=[];

  alumnos: Alumno[] = [
    { nombre: 'Julio', grupo: "3pag2"},
    { nombre: 'Alejandro', grupo: "3pag2"}
  ];

  // productosElectronica: Producto[] = [
  //   { nombre: 'Televisor Samsung', precio: 399.99, selected: false },
  //   { nombre: 'Auriculares Sony', precio: 99.99, selected: false }
  // ];

  // productosRopa: Producto[] = [
  //   { nombre: 'Camiseta Nike', precio: 29.99, selected: false },
  //   { nombre: 'Pantalones Adidas', precio: 59.99, selected: false }
  // ];

  modalAtera = false;
  alumne = '';
  categoriasAbiertas: { [key: string]: boolean } = {};

  actualizarProductosSeleccionados(producto:any) {
    const index = this.productosSeleccionados.findIndex(p => p.id === producto.id);
  
    if (producto.selected && index === -1) {
      // Si el producto está seleccionado y no está en la lista, lo agrega
      this.productosSeleccionados.push(producto);
    } else if (!producto.selected && index !== -1) {
      // Si el producto no está seleccionado y está en la lista, lo elimina
      this.productosSeleccionados.splice(index, 1);
    }
  
    console.log('Productos seleccionados:', this.productosSeleccionados);
  }

  // Función para alternar la visibilidad de una categoría
  toggleCategoria(categoria: string) {
    this.categoriasAbiertas[categoria] = !this.categoriasAbiertas[categoria];
  }

  // Función para verificar si una categoría está abierta
  isCategoriaAbierta(categoria: string): boolean {
    return this.categoriasAbiertas[categoria] || false;
  }

  editarProducto(producto: any) {
    // Función para editar el producto
    console.log('Editando producto:', producto);
  }

  eliminarProducto(producto: any) {
    // Función para eliminar el producto
    console.log('Eliminando producto:', producto);
  }

  confirmarSacarProductos() {
    if (this.alumne) {
      // Lógica para confirmar la acción de sacar productos
      alert(`Productos sacados por ${this.alumne}`);
      this.modalAtera = false;
      this.alumne = ''; // Limpiar el campo de alumno
    } else {
      alert('Por favor, ingrese el nombre del alumno.');
    }
  }

  abrirModalAgregarProducto() {
    // Función para abrir el modal de agregar producto
  }

  sacarProductos() {
    // Función para abrir el modal de sacar productos
    this.modalAtera = true;
  }

  cerrarModal() {
    this.modalAtera = false;
  }

  async produktuakLortu() {
    try {
      const response = await fetch('http://localhost:8080/api/produktu_kategoria', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
  
      const datuak = await response.json();
      
      // Filtramos las categorías y productos activos (sin `ezabatzeData`)
      this.produktuak = datuak
        .filter((categoria:any) => categoria.ezabatzeData === null)
        .map((categoria:any) => ({
          id: categoria.id,
          izena: categoria.izena,
          sortzeData: categoria.sortzeData,
          produktuak: categoria.produktuak
            .filter((producto:any) => producto.ezabatzeData === null)
            .map((producto:any) => ({
              id: producto.id,
              izena: producto.izena,
              deskribapena: producto.deskribapena,
              marka: producto.marka,
              stock: producto.stock,
              stockAlerta: producto.stockAlerta,
              sortzeData: producto.sortzeData
            }))
        }));
  
      console.log('Produktuak kargatu:', this.produktuak);
  
    } catch (e) {
      console.error("Errorea produktuak kargatzerakoan:", e);
    }
  }

  constructor() { }

  ngOnInit() {
    this.produktuakLortu();
  }

}
