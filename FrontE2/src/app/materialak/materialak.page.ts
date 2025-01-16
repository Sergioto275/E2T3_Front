import { Component, OnInit } from '@angular/core';

export interface Producto {
  nombre:string,
  selected:boolean
}

export interface Alumno {
  nombre: string;
  grupo: string;
}

@Component({
  selector: 'app-materialak',
  templateUrl: './materialak.page.html',
  styleUrls: ['./materialak.page.scss'],
})
export class MaterialakPage implements OnInit {

  materialak!:any[];

  productosSeleccionados:any[]=[];

  alumnos: Alumno[] = [
    { nombre: 'Julio', grupo: "3pag2"},
    { nombre: 'Alejandro', grupo: "3pag2"}
  ];

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

  async materialakLortu() {
    try {
      const response = await fetch('http://localhost:8080/api/material_kategoria', {
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
      
      // Filtramos las categorías y materiales activos (sin `ezabatzeData`)
      this.materialak = datuak
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
              etiketa: producto.etiketa,
              sortzeData: producto.sortzeData
            }))
        }));
  
      console.log('Materialak kargatu:', this.materialak);
  
    } catch (e) {
      console.error("Errorea materialak kargatzerakoan:", e);
    }
  }

  constructor() { }

  ngOnInit() {
    this.materialakLortu();
  }

}
