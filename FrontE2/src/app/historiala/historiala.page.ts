import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-historiala',
  templateUrl: './historiala.page.html',
  styleUrls: ['./historiala.page.scss'],
})
export class HistorialaPage implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  selectedLanguage: string = 'es';
  produktuMugimendu: any[] = [];
  produktuMugimenduFiltered: any[] = [];
  materialMugimendu: any[] = [];
  materialMugimenduFiltered: any[] = [];
  tickets: any[] = [];
  ticketsFiltered: any[] = [];
  bezeroak: any[] = [];
  bezeroakFiltered: any[] = [];
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
  fechaInicioFilterProd: any = null;
  fechaFinFilterProd: any = null;
  fechaInicioFilterMat: any = null;
  fechaFinFilterMat: any = null;
  fechaInicioFilterTicket: any = null;
  fechaFinFilterTicket: any = null;
  filtroIzena!:string;

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

  filterProduktos() {
    this.produktuMugimenduFiltered = this.produktuMugimendu.map(prod => ({
      ...prod,
      // cualquier otra transformación que necesites
    }));
  
    this.produktuMugimenduFiltered = this.produktuMugimenduFiltered.filter(prod => {
      const horarioFecha = this.convertToDate(prod.data); // Convertir a objeto Date
      const inicio = this.fechaInicioFilterProd ? this.convertToDate(this.fechaInicioFilterProd) : null;
      const fin = this.fechaFinFilterProd ? this.convertToDate(this.fechaFinFilterProd) : null;
  
      return (
        (!inicio || horarioFecha >= inicio) &&
        (!fin || horarioFecha <= fin)
      );
    });
  }

  filterMateriales() {
    this.materialMugimenduFiltered = this.materialMugimendu.map(mat => ({
      ...mat,
    }));
  
    this.materialMugimenduFiltered = this.materialMugimenduFiltered.filter(mat => {
      const horarioFecha = this.convertToDate(mat.hasieraData); // Convertir a objeto Date
      const inicio = this.fechaInicioFilterMat ? this.convertToDate(this.fechaInicioFilterMat) : null;
      const fin = this.fechaFinFilterMat ? this.convertToDate(this.fechaFinFilterMat) : null;
  
      return (
        (!inicio || horarioFecha >= inicio) &&
        (!fin || horarioFecha <= fin)
      );
    });
  }

  filterTickets() {
    this.ticketsFiltered = this.tickets.map(ticket => ({
      ...ticket,
    }));
  
    this.ticketsFiltered = this.ticketsFiltered.filter(ticket => {
      const horarioFecha = this.convertToDate(ticket.data); // Convertir a objeto Date
      const inicio = this.fechaInicioFilterTicket ? this.convertToDate(this.fechaInicioFilterTicket) : null;
      const fin = this.fechaFinFilterTicket ? this.convertToDate(this.fechaFinFilterTicket) : null;
  
      return (
        (!inicio || horarioFecha >= inicio) &&
        (!fin || horarioFecha <= fin)
      );
    });
  }

  filterBezero() {
    this.bezeroakFiltered = this.bezeroak.map(bezero => ({
      ...bezero,
    }));
  
    if (this.filtroIzena !== '') {
      this.bezeroakFiltered = this.bezeroakFiltered.filter(bezero =>
        (this.filtroIzena === '' ||
          bezero.izena.toLowerCase().includes(this.filtroIzena.toLowerCase()) ||
          bezero.abizena.toLowerCase().includes(this.filtroIzena.toLowerCase()))
      );
    }
  }
  
  
  // Función para convertir la fecha a un objeto Date sin hora
  convertToDate(date: any): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Asegúrate de que las horas, minutos, segundos y milisegundos sean 0
    return d;
  }
  
  resetProduktos() {
    this.fechaInicioFilterProd = null;
    this.fechaFinFilterProd = null;
    this.produktuMugimenduFiltered = this.produktuMugimendu.map(prod => ({
      ...prod,
    }));  
  }

  resetMateriales() {
    this.fechaInicioFilterMat = null;
    this.fechaFinFilterMat = null;
    this.materialMugimenduFiltered = this.materialMugimendu.map(mat => ({
      ...mat,
    }));  
  }

  resetTickets() {
    this.fechaInicioFilterTicket = null;
    this.fechaFinFilterTicket = null;
    this.ticketsFiltered = this.tickets.map(ticket => ({
      ...ticket,
    }));  
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
      this.produktuMugimenduFiltered = this.produktuMugimendu;
    } catch (error) {
      console.log("Error al cargar citas:", error);
    }
  }

  async cargarMovimientoMateriales() {
    this.materialMugimendu = [];
    try {
      const response = await fetch(`${environment.url}material_mailegua`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Error al obtener las materiales');
      }
      const datuak = await response.json();
      this.materialMugimendu = datuak.filter((mat:any) => mat.ezabatzeData === null);
      this.materialMugimenduFiltered = this.materialMugimendu;
    } catch (error) {
      console.log("Error al cargar material:", error);
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
      this.ticketsFiltered = this.tickets;
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
      this.bezeroakFiltered = this.bezeroak;
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
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  ngOnInit() {
    this.cargarMovimientoProductos();
    this.cargarMovimientoMateriales();
    this.cargarTickets();
    this.cargarClientes();
    this.cargarProductos();
  }

}
