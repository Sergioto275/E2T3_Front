import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-historiala',
  templateUrl: './historiala.page.html',
  styleUrls: ['./historiala.page.scss'],
})
export class HistorialaPage implements OnInit {

  selectedLanguage: string = 'es';
  produktuMugimendu: any[] = [];
  tickets: any[] = [];
  bezeroak: any[] = [];
  produktuak: any[] = [];
  crearNombre!:String;
  crearApellido!:String;
  crearTelefono!:String;
  crearPiel!:boolean;
  historialaVisible:any[] = [];

  isEditingBezero: boolean = false; // Controla si se muestra el modal de edición
  editingBezero: any = null;        // Objeto del cliente que se está editando
  viewingBezero: any = null;        // Cliente cuyos detalles se están viendo
  isViewingHistorial: boolean = false; // Controla si se muestra el historial
  bezeroForm: FormGroup;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  
    this.bezeroForm = this.fb.group({
      izena: ['', Validators.required],
      abizena: ['', Validators.required],
      telefonoa: ['', Validators.required],
      azalSentikorra: ['', Validators.required]
    });
  }

  // Función: cargarHitzordu
  async cargarMovimientoProductos() {
    this.produktuMugimendu = [];
    try {
      const response = await fetch(`${environment.url}produktu_mugimenduak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Error al obtener las citas');
      }
      const datuak = await response.json();
      this.produktuMugimendu = datuak.filter((prod:any) => prod.ezabatzeData === null);
    } catch (error) {
      console.log("Error al cargar citas:", error);
    }
  }

   // Función: cargarHitzordu
   async cargarTickets() {
    this.tickets = [];
    try {
      const response = await fetch(`${environment.url}hitzorduak/ticket`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Error al obtener las citas');
      }
      const datuak = await response.json();
      this.tickets = datuak.filter((citas:any) => citas.ezabatzeData === null);
    } catch (error) {
      console.log("Error al cargar citas:", error);
    }
  }

  async cargarCita(id:number) {
    try {
      const response = await fetch(`${environment.url}hitzorduak/id/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Error al obtener las citas');
      }
      const datuak = await response.json();
      this.descargar_ticket(datuak);
    } catch (error) {
      console.log("Error al cargar citas:", error);
    }
  }

  descargar_ticket(datuak: any) {
    const pdf = new jsPDF();
    const margenIzquierdo = 10;
    let posicionY = 20;
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Ticket de Cita", margenIzquierdo, posicionY);
    posicionY += 10;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Data: ${datuak.data}`, margenIzquierdo, posicionY);
    posicionY += 7;
    pdf.text(`Hasiera Ordua: ${datuak.hasieraOrduaErreala}`, margenIzquierdo, posicionY);
    posicionY += 7;
    pdf.text(`Amaiera Ordua: ${datuak.amaieraOrduaErreala}`, margenIzquierdo, posicionY);
    posicionY += 7;
    pdf.text(`Langilea: ${datuak.langilea?.izena}`, margenIzquierdo, posicionY);
    posicionY += 10;
    const head = [
      ['Zerbitzua', 'Prezioa (€)']
    ];
    const body = datuak.lerroak.map((lerro: any) => [
      lerro.zerbitzuak.izena,
      lerro.prezioa.toFixed(2)
    ]);
    autoTable(pdf, {
      startY: posicionY,
      margin: { left: margenIzquierdo, right: margenIzquierdo },
      head: head,
      body: body,
      theme: 'grid',
      styles: { fontSize: 10, halign: 'center' },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] }
    });
    posicionY = (pdf as any).lastAutoTable.finalY + 10;
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `PREZIO TOTALA: ${datuak.prezioTotala.toFixed(2)} €`,
      margenIzquierdo,
      posicionY
    );
    pdf.save(`ticket_${datuak.id}.pdf`);
  }

  async cargarClientes() {
    this.bezeroak = [];
    try {
      const response = await fetch(`${environment.url}bezero_fitxak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Error al obtener las clientes');
      }
      const datuak = await response.json();
      this.bezeroak = datuak.filter((bezero: any) => bezero.ezabatzeData === null)
      } catch (error) {
      console.log("Error al cargar clientes:", error);
    }
  }
  
  async cargarProductos() {
    this.bezeroak = [];
    try {
      const response = await fetch(`${environment.url}produktuak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Error al obtener las clientes');
      }
      const datuak = await response.json();
      this.produktuak = datuak.filter((prod:any) => prod.ezabatzeData === null);
    } catch (error) {
      console.log("Error al cargar clientes:", error);
    }
  }

  openBezero(bezero: any) {
    this.isEditingBezero = true;
    this.editingBezero = bezero;
  }

  cerrarModal() {
    this.isEditingBezero = false; // Cierra el modal
  }

  add_historial(){
    const hist = {
      data:null,
      kantitatea:0,
      bolumena:"",
      oharrak: "",
      produktuIzena:""
    }
    this.editingBezero.historiala.push(hist);
    console.log(this.editingBezero)
  }

  remove_historial(index: number) {
    let historial = this.editingBezero.historiala[index];
    if (historial.id) {
        historial.ezabatzeData = new Date().toISOString(); // Marca como eliminado
    } else {
        this.editingBezero.historiala.splice(index, 1); // Si es nuevo, elimínalo
    }
  }
  
  async guardar_bezero() {
    try {
      console.log(JSON.stringify(this.editingBezero))
      const response = await fetch(`${environment.url}bezero_fitxak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "PUT",
        body: JSON.stringify(this.editingBezero)
      });
  
      if (!response.ok) {
        throw new Error('Error al asignar la cita');
      }
      await this.cargarClientes();
      this.cerrarModal();
    } catch (error) {
      console.error("Error al asignar la cita:", error);
    }
  }

  async crear_bezero() {
    try {
      const json_data = {
        "izena": this.crearNombre,
        "abizena": this.crearApellido,
        "telefonoa": this.crearTelefono,
        "azalSentikorra": this.crearPiel ? "B" : "E",
      };
      console.log(JSON.stringify(json_data))
      const response = await fetch(`${environment.url}bezero_fitxak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "POST",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Error al asignar la cita');
      }
      // toastr.success(this.translations[this.currentLocale].default.actualizar);
      await this.cargarClientes();
      // this.limpiar_campos();
    } catch (error) {
      console.error("Error al asignar la cita:", error);
    }
  }

  async deleteBezero(id:number) {
    try {
      const json_data = {
        "id": id
      };
      console.log(JSON.stringify(json_data))
      const response = await fetch(`${environment.url}bezero_fitxak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "DELETE",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Error al asignar la cita');
      }
      await this.cargarClientes();
    } catch (error) {
      console.error("Error al asignar la cita:", error);
    }
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  ngOnInit() {
    this.cargarMovimientoProductos();
    this.cargarTickets();
    this.cargarClientes();
    this.cargarProductos();
  }

}
