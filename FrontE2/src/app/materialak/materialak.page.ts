import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';

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
  selectedLanguage: string = 'es';
  modal!:string;

  materialesSeleccionados:any[]=[];
  materialak!:any;
  materialaDevolver!:any;

  crearKatNombre!:String;
  crearNombre!:String;
  crearEtiqueta!:String;
  crearCategoria!:Number;

  editarKatNombre!:String;
  editarId!:Number;
  editarNombre!:String;
  editarEtiqueta!:String;
  editarCategoria!:Number;
  
  selectedCategoryId!:number;

  alumnos!: any[];
  selecTaldea!:number;
  selecAlumno!:number;

  @ViewChild('modaleditarcat', { static: true })
  modaleditarcat!: IonModal;
  selectedCategory: any = {};

  modalAtera = false;
  alumne = '';
  categoriasAbiertas: { [key: string]: boolean } = {};
  filteredAlumnos!: any[];

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  actualizarMaterialesSeleccionados(material:any, kategoria_id: number) {
    material.kategoria_id = kategoria_id;
    material.kantitatea = 1;
    const index = this.materialesSeleccionados.findIndex(p => p.id === material.id);
    if (material.selected && index === -1) {
      this.materialesSeleccionados.push(material);
    } else if (!material.selected && index !== -1) {
      this.materialesSeleccionados.splice(index, 1);
    }
    console.log('Materiales seleccionados:', this.materialesSeleccionados);
  }

  toggleCategoria(categoria: string) {
    this.categoriasAbiertas[categoria] = !this.categoriasAbiertas[categoria];
  }

  isCategoriaAbierta(categoria: string): boolean {
    return this.categoriasAbiertas[categoria] || false;
  }

  materialaSortu(){
    let data = {
      "etiketa": this.crearEtiqueta,
      "izena": this.crearNombre,
      "materialKategoria": {
          "id": this.crearCategoria
      }
  }
    let observableRest: Observable<any> = this.restServer.post<any>("http://localhost:8080/api/materialak", data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
    });
    this.materialakLortu();
  }

  kategoriaSortu(){
    let data = {
      "izena": this.crearKatNombre,
    } 
    let observableRest: Observable<any> = this.restServer.post<any>('http://localhost:8080/api/material_kategoria', data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
    });
    this.materialakLortu();
  }

  materialaEditatu(){
    let data = {
      "id": this.editarId,
      "etiketa": this.editarEtiqueta,
      "izena": this.editarNombre,
      "materialKategoria": {
          "id": this.editarCategoria
      },
    }

    let observableRest: Observable<any> = this.restServer.put<any>("http://localhost:8080/api/materialak",data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
	  });
    this.materialakLortu();
  }

  materialaEzabatu(id:number){
    let observableRest: Observable<any> = this.restServer.delete<any>(`http://localhost:8080/api/materialak/id/${id}`);
    observableRest.subscribe(datuak => {
      console.log(datuak);
    });
    this.materialakLortu();
  }  

  kategoriaEzabatu(id:number){
    let observableRest: Observable<any> = this.restServer.delete<any>(`http://localhost:8080/api/material_kategoria/id/${id}`);
    observableRest.subscribe(datuak => {
      console.log(datuak);
    });
    this.materialakLortu();
  }  

  kategoriaEditatu(id: number){
    let data = {
      "izena": this.editarKatNombre
    }
    let observableRest: Observable<any> = this.restServer.put<any>(`http://localhost:8080/api/material_kategoria/id/${id}`, data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
    });
    this.materialakLortu();
    this.materialakLortuDevolver();
  }
  
  cargarEditarMateriales() {
    this.editarId = this.materialesSeleccionados[0].id;
    this.editarNombre = this.materialesSeleccionados[0].izena;
    this.editarEtiqueta = this.materialesSeleccionados[0].etiketa;
    this.editarCategoria = this.materialesSeleccionados[0].kategoria_id;
  }

  materialakAtera(){
    let data =
    [
      {
          "materiala": {
              "id": 2
          },
          "langilea": {
              "id": 1
          }
      }
    ]

    let observableRest: Observable<any> = this.restServer.post<any>("http://localhost:8080/api/material_mailegua",data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
    });
    this.materialakLortu();
    this.materialakLortuDevolver();
  }

  materialakLortu(){
    let observableRest: Observable<any> = this.restServer.get<any>('http://localhost:8080/api/material_kategoria');
    observableRest.subscribe(datuak => {
      console.log(datuak);

    this.materialak = datuak
    .filter((categoria:any) => categoria.ezabatzeData === null)
    .map((categoria:any) => ({
      id: categoria.id,
      izena: categoria.izena,
      sortzeData: categoria.sortzeData,
      materialak: categoria.materialak
        .filter((material:any) => material.ezabatzeData === null)
        .map((material:any) => ({
          id: material.id,
          etiketa: material.etiketa,
          izena: material.izena,
          sortzeData: material.sortzeData
        }))
    }));
    });
  }

  materialakLortuDevolver(){
    let observableRest: Observable<any> = this.restServer.get<any>('http://localhost:8080/api/material_mailegua');
    observableRest.subscribe(datuak => {
      console.log(datuak);

      this.materialaDevolver = datuak
      
    });
  }

  langileakLortu(){
    let observableRest: Observable<any> = this.restServer.get<any>('http://localhost:8080/api/taldeak');
    observableRest.subscribe(datuak => {
      console.log(datuak);
      
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
    });
  }  

  abrirEditarCategoria(categoria:any) {
    this.modaleditarcat.present();
    this.selectedCategory = {...categoria};
    this.editarKatNombre = this.selectedCategory.izena;
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


  constructor(private translate: TranslateService, private restServer:HttpClient, private modalController: ModalController) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  }
  
  ngOnInit() {
    this.materialakLortu();
    this.langileakLortu();
    this.materialakLortuDevolver();
  }

}
