import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
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

  crearKatNombre:String| null = null;
  crearNombre:String| null = null;
  crearEtiqueta:String| null = null;
  crearCategoria:Number| null = null;

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

  mostrarFiltros: boolean = false;

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

  async materialaSortu(){
    let data = {
      "etiketa": this.crearEtiqueta,
      "izena": this.crearNombre,
      "materialKategoria": {
          "id": this.crearCategoria
      }
  }
    let observableRest: Observable<any> = this.restServer.post<any>("http://localhost:8080/api/materialak", data);
    await observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
      this.vaciarDatos();
    });
  }

  async kategoriaSortu(){
    let data = {
      "izena": this.crearKatNombre,
    } 
    let observableRest: Observable<any> = this.restServer.post<any>('http://localhost:8080/api/material_kategoria', data);
    await observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
      this.vaciarDatos();
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


  vaciarDatos(){
    this.crearEtiqueta = null;
    this.crearNombre = null;
    this.crearCategoria = null;
    this.crearKatNombre = null;
    this.materialesSeleccionados = [];
  }

  materialaEzabatu(id:number){
    let observableRest: Observable<any> = this.restServer.delete<any>(`http://localhost:8080/api/materialak/id/${id}`);
    observableRest.subscribe(datuak => {
      console.log(datuak);
      this.materialakLortu();
      this.vaciarDatos();
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

  materialakBueltatu(){
    let data = this.materialesSeleccionadosDevolver.map(mailegu => ({
      "id": mailegu.id
  }));

    let observableRest: Observable<any> = this.restServer.put<any>('http://localhost:8080/api/material_mailegua', data);
    observableRest.subscribe(datuak => {
      console.log(datuak);

      this.materialaDevolver = datuak
      this.materialakLortu();
      this.materialakLortuDevolver();
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

  async confirmarEliminarMaterial(id: number) {
    const alert = await this.alertController.create({
      header: this.translate.instant('materiales.modal.confirmacion'),
      message: this.translate.instant('materiales.modal.mensajeAlertaBorrarMats'),
      buttons: [
        {
          text: this.translate.instant('materiales.botones.cancelar'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('materiales.botones.borrar'),
          handler: () => {
            this.materialaEzabatu(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmarEliminarCategoria(id: number) {
    const alert = await this.alertController.create({
      header: this.translate.instant('materiales.modal.confirmacion'),
      message: this.translate.instant('materiales.modal.mensajeAlertaBorrarCats'),
      buttons: [
        {
          text: this.translate.instant('materiales.botones.cancelar'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('materiales.botones.borrar'),
          handler: () => {
            this.kategoriaEzabatu(id);
          },
        },
      ],
    });

    await alert.present();
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

  constructor(private translate: TranslateService, private restServer:HttpClient, private alertController: AlertController) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  }
  
  ngOnInit() {
    this.materialakLortu();
    this.langileakLortu();
    this.materialakLortuDevolver();
  }

}
