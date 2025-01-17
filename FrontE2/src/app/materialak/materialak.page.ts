import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
  materialak!:any[];

  materialesSeleccionados:any[]=[];

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
  editarEtiqueta!:String;
  editarCategoria!:Number;

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

  async crearMaterial(){
    try {
      const json_data = {
          "izena": this.crearNombre,
          "materialKategoria": {
              "id": this.crearCategoria
          },
          "deskribapena": this.crearDescripcion,
          "marka": this.crearMarca,
          "stock": this.crearStock,
          "stockAlerta": this.crearStockAlerta
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/materialak', {
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
      await this.materialakLortu();  
    } catch (e) {
      console.error("Errorea materialak kargatzerakoan:", e);
    }
  }

  async kategoriaSortu(){
    try {
      const json_data = {
          "izena": this.crearKatNombre
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/material_kategoria', {
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
      await this.materialakLortu();  
    } catch (e) {
      console.error("Errorea materialak kargatzerakoan:", e);
    }
  }

  async editarMaterial(){
    try {
      const json_data = {
          "id": this.editarId,
          "izena": this.editarNombre,
          "etiketa": this.editarEtiqueta,
          "materialKategoria": {
              "id": this.editarCategoria
          },
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/materialak', {
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
      await this.materialakLortu();  
    } catch (e) {
      console.error("Errorea materialak kargatzerakoan:", e);
    }
  }

  async eliminarMaterial(id:number){
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este material?');
    if (!confirmacion) {
      console.log('Operación cancelada por el usuario.');
      return;
    }
    try {
      const json_data = {
          "id": id
      }
      console.log(json_data);
      const response = await fetch('http://localhost:8080/api/materialak', {
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
      await this.materialakLortu();  
    } catch (e) {
      console.error("Errorea materialak kargatzerakoan:", e);
    }
  }

  async eliminarKategoriaMaterial(id:number){
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
      const response = await fetch('http://localhost:8080/api/material_kategoria', {
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
      await this.materialakLortu();  
    } catch (e) {
      console.error("Errorea materialak kargatzerakoan:", e);
    }
  }

  cargarEditarMateriales() {
    this.editarId = this.materialesSeleccionados[0].id;
    this.editarNombre = this.materialesSeleccionados[0].izena;
    this.editarEtiqueta = this.materialesSeleccionados[0].etiketa;
    this.editarCategoria = this.materialesSeleccionados[0].kategoria_id;
  }

  async sacarMateriales() {
    try {
      const movimientos = this.materialesSeleccionados.map(material => ({
        "material": {
          "id": material.id // El ID del material dentro de un objeto
        },
        "langile": {
          "id": this.selecAlumno // El ID del alumno dentro de un objeto
        },
        "data": new Date().toISOString(), // Fecha en formato ISO
        "kopurua": material.kantitatea // La cantidad del material
      }));
      
      // Asegúrate de que el JSON sea un array válido antes de enviarlo.      
      console.log(JSON.stringify(movimientos));
      const response = await fetch('http://localhost:8080/api/material_mugimenduak', {
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
      await this.materialakLortu(); 
    } catch (error) {
      console.error('Error al registrar los movimientos', error);
    }
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
          materialak: categoria.materialak
            .filter((material:any) => material.ezabatzeData === null)
            .map((material:any) => ({
              id: material.id,
              izena: material.izena,
              deskribapena: material.deskribapena,
              marka: material.marka,
              stock: material.stock,
              stockAlerta: material.stockAlerta,
              sortzeData: material.sortzeData
            }))
        }));
  
      console.log('Materialak kargatu:', this.materialak);
  
    } catch (e) {
      console.error("Errorea materialak kargatzerakoan:", e);
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
    this.materialakLortu();
    this.langileakLortu();
  }

}
