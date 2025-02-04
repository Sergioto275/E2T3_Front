import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tratamenduak',
  templateUrl: './tratamenduak.page.html',
  styleUrls: ['./tratamenduak.page.scss'],
})
export class TratamenduakPage implements OnInit {

  selectedLanguage: string = 'es';
  zerbitzuak:any[] = [];
  modalAtera = false;
  alumne = '';
  categoriasAbiertas: { [key: string]: boolean } = {};
  filteredAlumnos!: any[];
  selectedCategoryId!: number;
  crearServicio: any = { izena: '', idKategoria: null, kanpokoPrezioa: '', etxekoPrezioa: '' };
  crearCategoria: any = { izena: '', kolorea: false, extra: false };
  editarCategoria:any;
  editarServicio:any;
  serviciosSeleccionados:any[]=[];
  isEditingService: boolean = false;
  isEditingCategoria: boolean = false;

  constructor(private translate: TranslateService) {
      this.translate.setDefaultLang('es');
      this.translate.use(this.selectedLanguage);
    }

  ngOnInit() {
    this.zerbiztuakLortu();
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  openServiceModal(service:any, idKat:number){
    this.isEditingService = true;
    this.editarServicio = service;
    this.editarServicio.idKategoria = idKat;
    console.log(this.editarServicio);
  }
  
  closeServiceModal(){
    this.isEditingService = false;
  }

  openKatModal(kategoria:any){
    this.isEditingCategoria = true;
    this.editarCategoria = kategoria;
    console.log(this.editarCategoria);
  }
  
  closeKatModal(){
    this.isEditingCategoria = false;
  }

  actualizarProductosSeleccionados(servicio:any, kategoria_id: number) {
    servicio.kategoria_id = kategoria_id;
    const index = this.serviciosSeleccionados.findIndex(p => p.id === servicio.id);
    if (servicio.selected && index === -1) {
      this.serviciosSeleccionados.push(servicio);
    } else if (!servicio.selected && index !== -1) {
      this.serviciosSeleccionados.splice(index, 1);
    }
    console.log('Productos seleccionados:', this.serviciosSeleccionados);
  }

  toggleCategoria(categoria: string) {
    this.categoriasAbiertas[categoria] = !this.categoriasAbiertas[categoria];
  }

  isCategoriaAbierta(categoria: string): boolean {
    return this.categoriasAbiertas[categoria] || false;
  }

  async zerbiztuakLortu() {
    try {
      const response = await fetch(`${environment.url}zerbitzu_kategoria`, {
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
      this.zerbitzuak = datuak
        .filter((categoria:any) => categoria.ezabatzeData === null)
        .map((categoria:any) => ({
          ...categoria,
          zerbitzuak: categoria.zerbitzuak
            .filter((zerbitzua:any) => zerbitzua.ezabatzeData === null)
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
  
      console.log('zerbitzuak kargatu:', this.zerbitzuak);
  
    } catch (e) {
      console.error("Errorea zerbitzuak kargatzerakoan:", e);
    }
  }

  async sortuZerbitzua(){
    try {
      const json_data = {
        "izena": this.crearServicio.izena,
        "zerbitzuKategoria":{
            "id": this.crearServicio.idKategoria
        },
        "etxekoPrezioa": this.crearServicio.etxekoPrezioa,
        "kanpokoPrezioa": this.crearServicio.kanpokoPrezioa
      }
    
      console.log(json_data);
      const response = await fetch(`${environment.url}zerbitzuak`, {
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
      await this.zerbiztuakLortu();
    } catch (e) {
      console.error("Errorea zerbitzuak kargatzerakoan:", e);
    }
  }

  async editarServicios(){
    try {
      const json_data = {
        "id": this.editarServicio.id,
        "izena": this.editarServicio.izena,
        "zerbitzuKategoria":{
            "id": this.editarServicio.idKategoria
        },
        "etxekoPrezioa": this.editarServicio.etxekoPrezioa,
        "kanpokoPrezioa": this.editarServicio.kanpokoPrezioa
      }
    
      console.log(json_data);
      const response = await fetch(`${environment.url}zerbitzuak`, {
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
      await this.zerbiztuakLortu();
    } catch (e) {
      console.error("Errorea zerbitzuak kargatzerakoan:", e);
    }
  }

  async eliminarServicio(id:number){
    try {
      const response = await fetch(`${environment.url}zerbitzuak/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "DELETE"
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      await this.zerbiztuakLortu();
    } catch (e) {
      console.error("Errorea zerbitzuak kargatzerakoan:", e);
    }
  }

  async crearKategoria(){
    try {
      const json_data = {
        "izena": this.crearCategoria.izena,
        "kolorea": this.crearCategoria.kolorea,
        "extra": this.crearCategoria.extra
      }
      console.log(json_data);
      const response = await fetch(`${environment.url}zerbitzu_kategoria`, {
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
      await this.zerbiztuakLortu();
      this.closeKatModal();
    } catch (e) {
      console.error("Errorea zerbitzuak kargatzerakoan:", e);
    }
  }

  async editarKategoria(){
    try {
      const json_data = {
        "id": this.editarCategoria.id,
        "izena": this.editarCategoria.izena,
        "kolorea": this.editarCategoria.kolorea,
        "extra": this.editarCategoria.extra
      }
      console.log(json_data);
      const response = await fetch(`${environment.url}zerbitzu_kategoria`, {
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
      await this.zerbiztuakLortu();
      this.closeKatModal();
    } catch (e) {
      console.error("Errorea zerbitzuak kargatzerakoan:", e);
    }
  }

  async eliminarKategoria(id:number){
    try {
      const response = await fetch(`${environment.url}zerbitzu_kategoria/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "DELETE"
      });
  
      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }
      await this.zerbiztuakLortu();
    } catch (e) {
      console.error("Errorea zerbitzuak kargatzerakoan:", e);
    }
  }

}
