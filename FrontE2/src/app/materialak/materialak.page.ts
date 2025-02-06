import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { HeaderComponent } from '../components/header/header.component';

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
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  selectedLanguage: string = 'es';
  modal!:string;

  materialesSeleccionados:any[]=[];
  materialesSeleccionadosDevolver:any[]=[];
  filteredMaterialak: any[] = []; 

  materialak!:any[];
  materialaDevolver!:any;

  crearKatNombre!:String;
  crearNombre!:String;
  crearEtiqueta!:String;
  crearCategoria!:Number;

  editarKatNombre!:String;
  editarNombre!:String;
  editarEtiqueta!:String;
  editarCategoria!:Number;
  matDevolverId!:Number;

  seleccionarId!:Number;

  selectedCategoryId!:number;

  alumnos!: any[];
  selecTaldea!:number;
  selecAlumno!:number;

  @ViewChild('modaleditarcat', { static: true })
  modaleditarcat!: IonModal;
  @ViewChild('modalEditar', { static: true })
  modalEditar!: IonModal;
  selectedCategory: any = {};
  selectedMateriala: any = {};

  modalAtera = false;
  alumne = '';
  categoriasAbiertas: { [key: string]: boolean } = {};
  filteredAlumnos!: any[];

  filtroCategoria: string = '';
  filtroMaterial: string = '';

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  actualizarMaterialesSeleccionados(material:any, kategoria_id: number) {
    const index = this.materialesSeleccionados.findIndex(p => p.id === material.id);
    if (material.selected && index === -1) {
      this.materialesSeleccionados.push(material);
    } else if (!material.selected && index !== -1) {
      this.materialesSeleccionados.splice(index, 1);
    }
    console.log('Materiales seleccionados:', this.materialesSeleccionados);
  }

  actualizarMaterialesSeleccionadosDevolver(material: any, isChecked: boolean) {
    const index = this.materialesSeleccionadosDevolver.findIndex(p => p.id === material.id);
  
    if (isChecked && index === -1) {
      this.materialesSeleccionadosDevolver.push(material);
    } else if (!isChecked && index !== -1) {
      this.materialesSeleccionadosDevolver.splice(index, 1);
    }
    material.selected = isChecked;
    console.log('Materiales seleccionados:', this.materialesSeleccionadosDevolver);
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
      this.materialakLortu();
    });
  }

  kategoriaSortu(){
    let data = {
      "izena": this.crearKatNombre,
    } 
    let observableRest: Observable<any> = this.restServer.post<any>('http://localhost:8080/api/material_kategoria', data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
    });
  }

  materialaEditatu(id:number){
    let data = {
      "etiketa": this.editarEtiqueta,
      "izena": this.editarNombre,
      "materialKategoria": {
          "id": this.editarCategoria
      },
    }

    let observableRest: Observable<any> = this.restServer.put<any>(`http://localhost:8080/api/materialak/id/${id}`, data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
	  });
  }

  materialaEzabatu(id:number){
    let observableRest: Observable<any> = this.restServer.delete<any>(`http://localhost:8080/api/materialak/id/${id}`);
    observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
    });
  }  

  kategoriaEzabatu(id:number){
    let observableRest: Observable<any> = this.restServer.delete<any>(`http://localhost:8080/api/material_kategoria/id/${id}`);
    observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
    });
  }  

  kategoriaEditatu(id: number){
    let data = {
      "izena": this.editarKatNombre
    }
    let observableRest: Observable<any> = this.restServer.put<any>(`http://localhost:8080/api/material_kategoria/id/${id}`, data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
    });
  }

  materialakAtera(){
    let data = this.materialesSeleccionados.map(materiala => ({
      "materiala": {
        "id": materiala.id
    },
      "langilea": {
        "id": this.selecAlumno
    }
  }));

    let observableRest: Observable<any> = this.restServer.post<any>("http://localhost:8080/api/material_mailegua",data);
    observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
      this.materialakLortuDevolver();
    });
  }

  materialakLortu(){
    let observableRest: Observable<any> = this.restServer.get<any>('http://localhost:8080/api/material_kategoria');
    observableRest.subscribe(datuak => {
      console.log(datuak);

    this.materialak = datuak
    .filter((categoria:any) => categoria.ezabatzeData === null)
    .map((categoria:any) => ({
      ...categoria,
      materialak: categoria.materialak
        .filter((material:any) => material.ezabatzeData === null)
    }));
    this.filteredMaterialak = this.materialak;
    });

  }

  materialakLortuDevolver() {
    let observableRest: Observable<any> = this.restServer.get<any>('http://localhost:8080/api/material_mailegua');

    observableRest.subscribe(datuak => {
        this.materialaDevolver = datuak.filter((mailegu:any) => 
            mailegu.hasieraData && !mailegu.amaieraData
        );
        console.log(this.materialaDevolver);
    });
}

  
  materialakBueltatu(){
    let data = this.materialesSeleccionadosDevolver.map(mailegu => ({
      "id": mailegu.id
  }));

    let observableRest: Observable<any> = this.restServer.put<any>('http://localhost:8080/api/material_mailegua', data);
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
        ...kategoria,
        langileak: kategoria.langileak
          .filter((langilea: any) => langilea.ezabatzeData === null)
      }));
    });
  }  

  abrirEditarCategoria(categoria:any) {
    this.modaleditarcat.present();
    this.selectedCategory = {...categoria};
    this.editarKatNombre = this.selectedCategory.izena;
  }

  abrirEditarMaterial(material:any) {
    console.log(material);
    this.modalEditar.present();
    this.selectedMateriala = {...material};
    this.editarNombre = material.izena;
    this.editarEtiqueta = material.etiketa;
    this.editarCategoria = material.kategoriaId;
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


  constructor(private translate: TranslateService, private restServer:HttpClient) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  }

  filtrarMateriales() {
    this.filteredMaterialak = this.materialak.map(categoria => ({
      ...categoria,
      materialak: categoria.materialak.map((material: any) => ({ ...material }))
    }));

    if(this.filtroCategoria !== '')
    {
      this.filteredMaterialak = this.filteredMaterialak.filter(categoria =>
        (this.filtroCategoria === '' || categoria.izena.toLowerCase().includes(this.filtroCategoria.toLowerCase()))
      );
    }

    if (this.filtroMaterial !== '') {
      this.filteredMaterialak = this.filteredMaterialak.map(categoria => ({
        ...categoria,
        materialak: categoria.materialak.filter((materiala: any) =>
          materiala.izena.toLowerCase().includes(this.filtroMaterial.toLowerCase())
        )
      }));
    }
  }
  
  ngOnInit() {
    this.materialakLortu();
    this.langileakLortu();
    this.materialakLortuDevolver();
  }

}
