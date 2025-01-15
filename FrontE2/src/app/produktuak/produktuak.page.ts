import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// import { IonButton, IonContent, IonHeader, IonLabel, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';


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

  selectedLanguage: string = 'es';
  modal!:string;
  produktuak!:any[];

  productosSeleccionados:any[]=[];

  crearKatNombre!:String;
  crearNombre!:String;
  crearDescripcion!:String;
  crearCategoria!:Number;
  crearMarca!:String;
  crearStock!:Number;
  crearStockAlerta!:Number;
  editarKatNombre!:String;
  editarId!:Number;
  editarNombre!:String;
  editarDescripcion!:String;
  editarCategoria!:Number;
  editarMarca!:String;
  editarStock!:Number;
  editarStockAlerta!:Number;

  alumnos!: any[];
  selecTaldea!:number;
  selecAlumno!:number;

  modalAtera = false;
  alumne = '';
  categoriasAbiertas: { [key: string]: boolean } = {};
  filteredAlumnos!: any[];

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  actualizarProductosSeleccionados(producto:any, kategoria_id: number) {
    producto.kategoria_id = kategoria_id;
    const index = this.productosSeleccionados.findIndex(p => p.id === producto.id);
    if (producto.selected && index === -1) {
      this.productosSeleccionados.push(producto);
    } else if (!producto.selected && index !== -1) {
      this.productosSeleccionados.splice(index, 1);
    }
    console.log('Productos seleccionados:', this.productosSeleccionados);
  }

  toggleCategoria(categoria: string) {
    this.categoriasAbiertas[categoria] = !this.categoriasAbiertas[categoria];
  }

  isCategoriaAbierta(categoria: string): boolean {
    return this.categoriasAbiertas[categoria] || false;
  }

  async crearProducto(){
    try {
      const json_data = {
          "izena": this.crearNombre,
          "produktuKategoria": {
              "id": this.crearCategoria
          },
          "deskribapena": this.crearDescripcion,
          "marka": this.crearMarca,
          "stock": this.crearStock,
          "stockAlerta": this.crearStockAlerta
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/produktuak', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "POST",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      await this.produktuakLortu();  
    } catch (e) {
      console.error("Errorea produktuak kargatzerakoan:", e);
    }
  }

  async kategoriaSortu(){
    try {
      const json_data = {
          "izena": this.crearKatNombre
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/produktu_kategoria', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "POST",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      await this.produktuakLortu();  
    } catch (e) {
      console.error("Errorea produktuak kargatzerakoan:", e);
    }
  }

  async editarProducto(){
    try {
      const json_data = {
          "id": this.editarId,
          "izena": this.editarNombre,
          "produktuKategoria": {
              "id": this.editarCategoria
          },
          "deskribapena": this.editarDescripcion,
          "marka": this.editarMarca,
          "stock": this.editarStock,
          "stockAlerta": this.editarStockAlerta
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/produktuak', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "PUT",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      await this.produktuakLortu();  
    } catch (e) {
      console.error("Errorea produktuak kargatzerakoan:", e);
    }
  }

  async eliminarProducto(id:number){
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (!confirmacion) {
      console.log('Operación cancelada por el usuario.');
      return;
    }
    try {
      const json_data = {
          "id": id
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/produktuak', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "DELETE",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      await this.produktuakLortu();  
    } catch (e) {
      console.error("Errorea produktuak kargatzerakoan:", e);
    }
  }

  async eliminarKategoriaProducto(id:number){
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar esta categoría?');
    if (!confirmacion) {
      console.log('Operación cancelada por el usuario.');
      return;
    }
    try {
      const json_data = {
          "id": id
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/produktu_kategoria', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "DELETE",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      await this.produktuakLortu();  
    } catch (e) {
      console.error("Errorea produktuak kargatzerakoan:", e);
    }
  }

  cargarEditarProducto() {
    this.editarId = this.productosSeleccionados[0].id;
    this.editarNombre = this.productosSeleccionados[0].izena;
    this.editarDescripcion = this.productosSeleccionados[0].deskribapena;
    this.editarCategoria = this.productosSeleccionados[0].kategoria_id;
    this.editarMarca = this.productosSeleccionados[0].marka;
    this.editarStock = this.productosSeleccionados[0].stock;
    this.editarStockAlerta = this.productosSeleccionados[0].stockAlerta;
  }

  confirmarSacarProductos() {
    if (this.alumne) {
      alert(`Productos sacados por ${this.alumne}`);
      this.modalAtera = false;
      this.alumne = '';
    } else {
      alert('Por favor, ingrese el nombre del alumno.');
    }
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

  async langileakLortu() {
    try {
      const response = await fetch('http://localhost:8080/api/taldeak', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      const datuak = await response.json();
      this.alumnos = datuak
        .filter((kategoria: any) => kategoria.ezabatzeData === null)
        .map((kategoria: any) => ({
          kodea: kategoria.kodea,
          izena: kategoria.izena,
          sortzeData: kategoria.sortzeData,
          langileak: kategoria.langileak
            .filter((langilea: any) => langilea.ezabatzeData === null)
            .map((langilea: any) => ({
              id: langilea.id,
              izena: langilea.izena,
              abizenak: langilea.abizenak,
              sortzeData: langilea.sortzeData,
              eguneratzeData: langilea.eguneratzeData,
            })),
        }));
      console.log('Kategoriak eta langileak:', this.alumnos);
  } catch (e) {
        console.error('Errorea langileak kargatzerakoan:', e);
    }
  }

  onGrupoChange() {
    if (!this.alumnos || this.alumnos.length === 0) {
      console.error('No hay datos en alumnos');
      this.filteredAlumnos = [];
      return;
    }
    const grupoSeleccionado = this.alumnos.find(taldea => taldea.kodea === this.selecTaldea);
    this.filteredAlumnos = grupoSeleccionado ? grupoSeleccionado.langileak : [];
  }


  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  }
  
  ngOnInit() {
    this.produktuakLortu();
    this.langileakLortu();
  }

}
