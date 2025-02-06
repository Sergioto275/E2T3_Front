import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../components/header/header.component';

// import { IonButton, IonContent, IonHeader, IonLabel, IonModal, IonTitle, IonToolbar } from '@ionic/angular/standalone';


export interface Alumno {
  nombre: string;
  grupo: string;
}

@Component({
  selector: 'app-produktuak',
  templateUrl: './produktuak.page.html',
  styleUrls: ['./produktuak.page.scss'],
})
export class ProduktuakPage implements OnInit {

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  selectedLanguage: string = 'es';
  modal!:string;
  produktuak!:any[];
  filteredProduktuak: any[] = []; 

  productosSeleccionados:any[]=[];
  isEditingProduct: boolean = false;
  editingProduct:any = null;
  isEditingKategoria: boolean = false;
  editingKategoria:any = null;

  crearKatNombre!:String;
  crearNombre!:String;
  crearDescripcion!:String;
  crearCategoria!:Number;
  crearMarca!:String;
  crearStock!:Number;
  crearStockAlerta!:Number;

  alumnos!: any[];
  selecTaldea!:number;
  selecAlumno!:number;

  categoriasAbiertas: { [key: string]: boolean } = {};
  filteredAlumnos!: any[];

  filtroCategoria: string = '';
  filtroProducto: string = '';
  filtroStockBajo: boolean = false;

  filtrarProductos() {
    this.filteredProduktuak = this.produktuak.map(categoria => ({
      ...categoria,
      produktuak: categoria.produktuak.map((producto: any) => ({ ...producto }))
    }));

    if(this.filtroCategoria !== '')
    {
      this.filteredProduktuak = this.filteredProduktuak.filter(categoria =>
        (this.filtroCategoria === '' || categoria.izena.toLowerCase().includes(this.filtroCategoria.toLowerCase()))
      );
    }

    if (this.filtroProducto !== '') {
      this.filteredProduktuak = this.filteredProduktuak.map(categoria => ({
        ...categoria,
        produktuak: categoria.produktuak.filter((producto: any) =>
          producto.izena.toLowerCase().includes(this.filtroProducto.toLowerCase())
        )
      }));
    }
  
    if (this.filtroStockBajo) {
      this.filteredProduktuak = this.filteredProduktuak.filter(categoria => {
        categoria.produktuak = categoria.produktuak.filter((producto: any) =>
          producto.stock <= producto.stockAlerta
        );
        return categoria.produktuak.length > 0;
      });
    }
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  actualizarProductosSeleccionados(producto:any, kategoria_id: number) {
    producto.kategoria_id = kategoria_id;
    producto.kantitatea = 1;
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
      const response = await fetch(`${environment.url}produktuak`, {
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
      const response = await fetch(`${environment.url}produktu_kategoria`, {
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

  openProdModal(product:any, idKat:number){
    this.isEditingProduct = true;
    this.editingProduct = product;
    this.editingProduct.idKategoria = idKat;
    console.log(this.editingProduct);
  }
  
  closeProdModal(){
    this.isEditingProduct = false;
  }

  openKatModal(kategoria:any){
    this.isEditingKategoria = true;
    this.editingKategoria = kategoria;
    console.log(this.editingKategoria);
  }
  
  closeKatModal(){
    this.isEditingKategoria = false;
  }

  async editarProducto(){
    try {
      const json_data = {
          "id": this.editingProduct.id,
          "izena": this.editingProduct.izena,
          "produktuKategoria": {
              "id": this.editingProduct.idKategoria
          },
          "deskribapena": this.editingProduct.deskribapena,
          "marka": this.editingProduct.marka,
          "stock": this.editingProduct.stock,
          "stockAlerta": this.editingProduct.stockAlerta
      }
      console.log(json_data);
      const response = await fetch(`${environment.url}produktuak`, {
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
      this.closeProdModal();
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
      const response = await fetch(`${environment.url}produktuak`, {
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
      const response = await fetch(`${environment.url}produktu_kategoria`, {
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

  async editarKategoriaProducto() {
    try {
      const json_data = { izena: this.editingKategoria.izena }; 
      console.log(json_data);
  
      const response = await fetch(`http://localhost:8080/api/produktu_kategoria/id/${this.editingKategoria.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'PUT',
        body: JSON.stringify(json_data),
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
  
      console.log('Categoría actualizada correctamente');
      await this.produktuakLortu();
      this.closeKatModal();
    } catch (e) {
      console.error('Errorea produktuak kargatzerakoan:', e);
    }
  }

  async sacarProductos() {
    try {
      const movimientos = this.productosSeleccionados.map(producto => ({
        "produktu": {
          "id": producto.id // El ID del producto dentro de un objeto
        },
        "langile": {
          "id": this.selecAlumno // El ID del alumno dentro de un objeto
        },
        "data": new Date().toISOString(), // Fecha en formato ISO
        "kopurua": producto.kantitatea // La cantidad del producto
      }));
      
      // Asegúrate de que el JSON sea un array válido antes de enviarlo.      
      console.log(JSON.stringify(movimientos));
      const response = await fetch(`${environment.url}produktu_mugimenduak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(movimientos),
      });
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      await this.produktuakLortu(); 
    } catch (error) {
      console.error('Error al registrar los movimientos', error);
    }
  }
  

  async produktuakLortu() {
    try {
      const response = await fetch(`${environment.url}produktu_kategoria`, {
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
          ...categoria,
          // id: categoria.id,
          // izena: categoria.izena,
          // sortzeData: categoria.sortzeData,
          produktuak: categoria.produktuak
            .filter((producto:any) => producto.ezabatzeData === null)
            // .map((producto:any) => ({
            //   id: producto.id,
            //   izena: producto.izena,
            //   deskribapena: producto.deskribapena,
            //   marka: producto.marka,
            //   stock: producto.stock,
            //   stockAlerta: producto.stockAlerta,
            //   sortzeData: producto.sortzeData
            // }))
        }));
      this.filteredProduktuak = this.produktuak;
  
      console.log('Produktuak kargatu:', this.produktuak);
  
    } catch (e) {
      console.error("Errorea produktuak kargatzerakoan:", e);
    }
  }

  async langileakLortu() {
    try {
      const response = await fetch(`${environment.url}taldeak`, {
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
