import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-hitzorduak',
  templateUrl: './hitzorduak.page.html',
  styleUrls: ['./hitzorduak.page.scss'],
})
export class HitzorduakPage implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  loading: boolean = true;
  serviciosSeleccionados: any[] = [];
  ordutegiak: any[] = [];
  asientos!:number;
  hitzorduArray: any[] = [];
  hitzorduak: any[] = [];
  tratamenduArray: any[] = [];
  tratamenduSelec: any[] = [];
  langileArray: any[] = [];
  hoursArray: any[] = [];
  rowspanAux: any[] = [];
  citaCrear:any = {"data":null, "hasieraOrdua":null, "amaieraOrdua":null, "eserlekua" :0, "izena":'', "telefonoa":'', "deskribapena":'', "etxekoa":false };
  citaEditar:any = {"data":null, "hasieraOrdua":null, "amaieraOrdua":null, "eserlekua" :0, "izena":'', "telefonoa":'', "deskribapena":'', "etxekoa":false };
  idLangile: any = null;
  dataSelec!: any;
  selectedLanguage: string = 'es';

  firstCell: { time: string, seat: number } | null = null;
  secondCell: { time: string, seat: number } | null = null;
  highlightedCells: { time: string, seat: number }[] = [];

  updateHighlightedCells() {
    if (this.firstCell && this.secondCell) {
      const minTimeIndex = Math.min(
        this.hoursArray.indexOf(this.firstCell.time),
        this.hoursArray.indexOf(this.secondCell.time)
      );
      const maxTimeIndex = Math.max(
        this.hoursArray.indexOf(this.firstCell.time),
        this.hoursArray.indexOf(this.secondCell.time)
      );
      this.highlightedCells = [];
      for (let i = minTimeIndex; i <= maxTimeIndex; i++) {
        this.highlightedCells.push({ time: this.hoursArray[i], seat: this.firstCell.seat });
      }
    }
  }

  resetSelection() {
    this.firstCell = null;
    this.secondCell = null;
    this.highlightedCells = [];
  }

  isCellHighlighted(time: string, seat: number): boolean {
    return this.highlightedCells.some(cell => cell.time === time && cell.seat === seat);
  }

   // Función: seleccionar_citaCrear
  reserbar_cita(eserlekua: number, time: string) {
    
    if(this.citaEditar.eserlekua == 0){
      if (this.firstCell && this.firstCell.seat !== eserlekua) {
        if (confirm("¿Desea cambiar de asiento?")) {
          this.resetSelection();
          this.limpiar_campos();
        } else {
          return;
        }
      }
      if(this.verificarSuperposicion(eserlekua, time, this.dataSelec, this.citaCrear.hasieraOrdua, this.citaCrear.amaieraOrdua, 0)){
        this.resetSelection();
        this.citaCrear.data = this.dataSelec;
        this.citaCrear.hasieraOrdua = time;
        this.citaCrear.amaieraOrdua = this.hoursArray[this.hoursArray.indexOf(time) + 1];
        this.citaCrear.eserlekua = eserlekua;
        this.firstCell = { time, seat: eserlekua };
        this.highlightedCells = [{ time, seat: eserlekua }];
        return;
      }
      if (this.citaCrear.data) {
        if (this.citaCrear.hasieraOrdua < time) {
          this.citaCrear.amaieraOrdua = this.hoursArray[this.hoursArray.indexOf(time) + 1];
          this.secondCell = { time, seat: eserlekua };
          this.updateHighlightedCells();
        } else {
          this.citaCrear.hasieraOrdua = time;
          this.firstCell = { time, seat: eserlekua };
          this.updateHighlightedCells();
        }
      } else {
        this.citaCrear.data = this.dataSelec;
        this.citaCrear.hasieraOrdua = time;
        this.citaCrear.amaieraOrdua = this.hoursArray[this.hoursArray.indexOf(time) + 1];
        this.citaCrear.eserlekua = eserlekua;
        this.firstCell = { time, seat: eserlekua };
        this.highlightedCells = [{ time, seat: eserlekua }];
      }
    }else{
      
      if (this.citaEditar.data != this.dataSelec) {
        if (confirm("¿Desea cambiar de día?")) {
          this.resetSelection();
          this.citaEditar.data = this.dataSelec;
          this.citaEditar.hasieraOrdua = time;
          this.citaEditar.amaieraOrdua = this.hoursArray[this.hoursArray.indexOf(time) + 1];
          this.citaEditar.eserlekua = eserlekua;
          this.firstCell = { time, seat: eserlekua };
          this.highlightedCells = [{ time, seat: eserlekua }];
          return;
        } else {
          return;
        }
      }
      if (this.citaEditar.eserlekua !== eserlekua) {
        if (confirm("¿Desea cambiar de asiento?")) {
          this.resetSelection();
          this.citaEditar.data = this.dataSelec;
          this.citaEditar.hasieraOrdua = time;
          this.citaEditar.amaieraOrdua = this.hoursArray[this.hoursArray.indexOf(time) + 1];
          this.citaEditar.eserlekua = eserlekua;
          this.firstCell = { time, seat: eserlekua };
          this.highlightedCells = [{ time, seat: eserlekua }];
          return;
        } else {
          return;
        }
      }
      if(this.verificarSuperposicion(eserlekua, time, this.dataSelec, this.citaEditar.hasieraOrdua, this.citaEditar.amaieraOrdua, this.citaEditar.id)){
        this.resetSelection();
        this.citaEditar.data = this.dataSelec;
        this.citaEditar.hasieraOrdua = time;
        this.citaEditar.amaieraOrdua = this.hoursArray[this.hoursArray.indexOf(time) + 1];
        this.citaEditar.eserlekua = eserlekua;
        this.firstCell = { time, seat: eserlekua };
        this.highlightedCells = [{ time, seat: eserlekua }];
        return;
      }
      if (this.citaEditar.hasieraOrdua < time) {
        this.citaEditar.amaieraOrdua = this.hoursArray[this.hoursArray.indexOf(time) + 1];
        this.secondCell = { time, seat: eserlekua };
        this.updateHighlightedCells();
      } else {
        this.citaEditar.hasieraOrdua = time;
        this.firstCell = { time, seat: eserlekua };
        this.updateHighlightedCells();
      }
    }
  }

  // Función para verificar si dos rangos de tiempo se solapan
  verificarSuperposicion(eserlekua: number, time: string, eguna: any, horaIniCita:any, horaFinCita:any,   id: number | null) {
    let horaInicio;
    let horaFin;
    if (horaIniCita > time || !horaIniCita) {
      horaInicio = time;
      horaFin = horaFinCita;
    } else {
      horaInicio = horaIniCita;
      horaFin = time;
    }
    const citasDelDia = this.hitzorduak.filter((hitzordu: any) => 
      (!hitzordu.ezabatze_data || hitzordu.ezabatze_data === "0000-00-00 00:00:00") && 
      hitzordu.data === eguna && 
      hitzordu.eserlekua === eserlekua &&
      (id ? hitzordu.id !== id : true)
    );
    const solapamiento = citasDelDia.some((cita: any) => {
      const citaInicio = cita.hasieraOrdua;
      const citaFin = cita.amaieraOrdua;
      return (
        (horaInicio < citaFin && horaFin > citaInicio)
      );
    });
    return solapamiento;
  }
  


  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage);
  }
  
  ngOnInit() {
    this.dataSelec = this.lortuData();
    this.cargarHitzordu();
    this.getHoursInRange();
    this.cargar_alumnos();
    this.cargarTratamenduak();
  }

  // Función: lortuData
  lortuData(): string {
    const gaur = new Date();
    const urtea = gaur.getFullYear();
    let hilabetea: string | number = gaur.getMonth() + 1; // Los meses comienzan en 0
    let eguna: string | number = gaur.getDate();
  
    if (eguna < 10) {
      eguna = '0' + eguna;
    }
    if (hilabetea < 10) {
      hilabetea = '0' + hilabetea;
    }
    return `${urtea}-${hilabetea}-${eguna}`;
  }

// ---------------------------------------------------------------------- CARGA DE DATOS --------------------------------------------------------------------------------

  // Función: cargarHitzordu
  async cargarHitzordu() {
    this.hitzorduArray = [];
    this.hitzorduak = [];
    try {
      const response = await fetch(`${environment.url}hitzorduak`, {
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
      this.hitzorduak = datuak.filter((hitzordu:any) => hitzordu.ezabatzeData === null);
      const eguna = formatDate(this.dataSelec, 'yyyy-MM-dd', 'en-US');
      this.hitzorduArray = this.hitzorduak.filter((hitzordu:any) => hitzordu.data.includes(eguna));
    } catch (error) {
      console.log("Error al cargar citas:", error);
    } finally {
      this.loading = false;
    }
  }

  // Función: cargar_asientos
  async cargar_alumnos() {
    try {
      const response = await fetch(`${environment.url}ordutegiak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
      if (!response.ok) {
        throw new Error('Error al obtener el número de asientos');
      }
      const datuak = await response.json();
      this.ordutegiak = datuak.filter((ordu:any) => ordu.ezabatzeData === null);
      console.log(this.ordutegiak);
    } catch (error) {
      console.log("Error al cargar los asientos:", error);
    }
    this.cargar_dia_seleccionado();
  }

  // Función: cargarTratamenduak
  async cargarTratamenduak() {
    try {
      const response = await fetch(`${environment.url}zerbitzu_kategoria`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });

      if (!response.ok) {
        throw new Error('Error al obtener tratamientos');
      }

      const datuak = await response.json();
      this.tratamenduArray = datuak.filter((tratamendua:any) => {
        const filteredZerbitzuak = tratamendua.zerbitzuak.filter(
          (zerbitzu:any) => zerbitzu.ezabatzeData === null
        );
        return filteredZerbitzuak;
      }).map((tratamendua:any) => {
        return {
          ...tratamendua,
          zerbitzuak: tratamendua.zerbitzuak.filter(
            (zerbitzu:any) => zerbitzu.ezabatzeData === null
          )
        };
      });
    } catch (error) {
      console.log("Error al cargar tratamientos:", error);
    }
  }

  // ---------------------------------------------------------------------- VISTA DE DATOS --------------------------------------------------------------------------------

  // Función: getCitasAtTimeAndSeat
  getCitasAtTimeAndSeat(time: string, seatId: number) {
    const filteredCitas = this.hitzorduArray.filter(cita =>
      cita.hasieraOrdua <= time && cita.amaieraOrdua > time && cita.eserlekua === seatId
    );
    return filteredCitas;
  }

  // Función: cargar_dia_seleccionado
  cargar_dia_seleccionado() {
    const eguna = formatDate(this.dataSelec, 'yyyy-MM-dd', 'en-US');
    const egunaDate = new Date(eguna);
    let diaSemana = egunaDate.getDay();
    diaSemana = diaSemana === 0 ? 7 : diaSemana;
    this.hitzorduArray = this.hitzorduak.filter((hitzordu: any) => 
      (!hitzordu.ezabatze_data || hitzordu.ezabatze_data === "0000-00-00 00:00:00") && hitzordu.data.includes(eguna)
    );
    const langileak = this.ordutegiak.filter((ordu: any) => {
      const hasieraDate = new Date(ordu.hasieraData);
      const amaieraDate = new Date(ordu.amaieraData);
      return (
        hasieraDate <= egunaDate && amaieraDate >= egunaDate && ordu.eguna === diaSemana
      );
    });
    if (this.langileArray.length == 0 && langileak.length > 0) {
      this.langileArray = langileak[0].taldea.langileak;
    }
    this.asientos = langileak.length > 0 ? langileak[0].taldea.langileak.length - 1 : 0;
    this.resetSelection();
    this.citaCrear = {"data":null, "hasieraOrdua":null, "amaieraOrdua":null, "eserlekua" :0, "izena":'', "telefonoa":'', "deskribapena":'', "etxekoa":false };
    // this.limpiar_campos();
  }
  
  
  // Función: getHoursInRange
  getHoursInRange(): void {
    const startTime = new Date('2022-01-01T09:00:00');
    const endTime = new Date('2022-01-01T14:30:00');
    this.hoursArray = [];
    while (startTime <= endTime) {
      const formattedHour = startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      this.hoursArray.push(formattedHour);
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
  }

  // Función: cita_sartuta
  citaSartuta(time: string, seatId: number): boolean {
    if (time === this.hoursArray[0] && seatId === 1) {
      this.rowspanAux = [];
    }
    const filteredCitas = this.hitzorduArray.filter((cita:any) => 
      cita.hasieraOrdua <= time 
      && cita.amaieraOrdua > time 
      && cita.eserlekua == seatId
    );
    if (filteredCitas.length == 0) {
      return true;
    }
    const citaID = filteredCitas[0].id;
    if (this.rowspanAux.includes(citaID)) {
      return false;
    } else {
      this.rowspanAux.push(citaID);
      return true;
    }
  }

  // // Función: rowspanManagement
  rowspanManagement(time: string, seatId: number): number {
    if (time === this.hoursArray[0] && seatId === 1) {
      this.rowspanAux = [];
    }
    const filteredCitas = this.hitzorduArray.filter(cita => 
      cita.hasieraOrdua <= time && cita.amaieraOrdua > time && cita.eserlekua === seatId
    );
    if (filteredCitas.length <= 0) {
      return 1;
    }
    const citaID = filteredCitas[0].id;
    let cant = 0;
    this.rowspanAux.push(citaID);
    this.hoursArray.forEach(element => {
      if (filteredCitas[0].hasieraOrdua <= element && filteredCitas[0].amaieraOrdua > element) {
        cant++;
      }
    });
    return cant;
  }
  
  // -------------------------------------------------------------------- CREAR DATOS -------------------------------------------------------------------------

  // Función: createCita
  async createCita() {
    try {
      const data = this.citaCrear.data;
      const hasOrdua = this.citaCrear.hasieraOrdua;
      const amaOrdua = this.citaCrear.amaieraOrdua;
      const eserlekua = this.citaCrear.eserlekua;
      const izena = this.citaCrear.izena;
      const telefonoa = this.citaCrear.telefonoa;
      const deskribapena = this.citaCrear.deskribapena;
      const etxeko = this.citaCrear.etxekoa ? "E" : "K";

      const json_data = {
        "data":data,
        "hasieraOrdua":hasOrdua,
        "amaieraOrdua":amaOrdua,
        "eserlekua" :eserlekua,
        "izena":izena,
        "telefonoa":telefonoa,
        "deskribapena":deskribapena,
        "etxekoa":etxeko
      };
      const response = await fetch(`${environment.url}hitzorduak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "POST",
        body: JSON.stringify(json_data)
      });

      if (!response.ok) {
        throw new Error('Error al crear la cita');
      }
      await this.cargarHitzordu();
      this.limpiar_campos();
    } catch (error) {
      console.error("Error al crear la cita:", error);
      throw new Error("No se ha creado la cita.");
    }
  }

  // ------------------------------------------------------------------ EDITAR DATOS ---------------------------------------------------------------

  async editar_cita() {
    try {
      const etxeko = this.citaEditar.etxekoa ? "E" : "K";
      const json_data = {
        "id": this.citaEditar.id,
        "data": this.citaEditar.data,
        "hasieraOrdua": this.citaEditar.hasieraOrdua,
        "amaieraOrdua": this.citaEditar.amaieraOrdua,
        "eserlekua": this.citaEditar.eserlekua,
        "izena": this.citaEditar.izena,
        "telefonoa": this.citaEditar.telefonoa,
        "deskribapena": this.citaEditar.deskribapena,
        "etxekoa": etxeko
      };
      const response = await fetch(`${environment.url}hitzorduak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "PUT",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar la cita');
      }
      await this.cargarHitzordu();
      this.limpiar_campos();
    } catch (error) {
      console.error("Error al editar la cita:", error);
    }
  }

// ----------------------------------------------------------------- ELIMINAR DATOS -----------------------------------------------------------------

async eliminar_cita() {
  try {
    const json_data = { "id": this.citaEditar.id };
    const response = await fetch(`${environment.url}hitzorduak`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      method: "DELETE",
      body: JSON.stringify(json_data)
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la cita');
    }
    await this.cargarHitzordu();
    this.limpiar_campos();
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
  }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    if (this.headerComponent) {
      this.headerComponent.loadTranslations();
    }
  }

  limpiar_campos() {
    this.tratamenduSelec = [];
    this.idLangile = null;
    this.citaCrear = {"data":null, "hasieraOrdua":null, "amaieraOrdua":null, "eserlekua" :0, "izena":'', "telefonoa":'', "deskribapena":'', "etxekoa":false };
    this.citaEditar = {"data":null, "hasieraOrdua":null, "amaieraOrdua":null, "eserlekua" :0, "izena":'', "telefonoa":'', "deskribapena":'', "etxekoa":false };
    this.resetSelection();
  }

  today(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }  

  cargar_cita_selec(citaSelec:any) {
    this.citaEditar = citaSelec;
    this.resetSelection();
  }

  actualizarServiciosSeleccionados(servicio:any, extra:boolean) {
    if (servicio.selected) {
      if (!extra) {
        servicio.precio = this.citaEditar.etxekoa ? servicio.etxekoPrezioa : servicio.kanpokoPrezioa;
      }
    }
    const index = this.serviciosSeleccionados.findIndex(s => s.id === servicio.id);
    if (servicio.selected && index === -1) {
      this.serviciosSeleccionados.push(servicio);
    } else if (!servicio.selected && index !== -1) {
      this.serviciosSeleccionados.splice(index, 1);
    }
  }

  async asignar_cita() {
    try {
      const json_data = {
        "id": this.citaEditar.id
      };
  
      const response = await fetch(`${environment.url}hitzorduak/asignar/${this.idLangile}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "PUT",
        body: JSON.stringify(json_data)
      });
  
      if (!response.ok) {
        throw new Error('Error al asignar la cita');
      }
      await this.cargarHitzordu();
      this.limpiar_campos();
    } catch (error) {
      console.error("Error al asignar la cita:", error);
    }
  }

  // Función: generar_ticket
  async generar_ticket() {
    let prezio_totala = 0;
    this.tratamenduSelec.forEach(tratamendu => {
      prezio_totala = Number(prezio_totala) + Number(tratamendu.prezioa);
    });
    try {
      const json_data = this.serviciosSeleccionados.map(servicio => ({
        "hitzordua": {
          "id": this.citaEditar.id 
        },
        "zerbitzuak": {
          "id": servicio.id 
        },
        "prezioa": servicio.precio
      }));
      const response = await fetch(`${environment.url}ticket_lerroak`, {
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
      await this.cargarHitzordu();
      const datuak = await response.json();
      if(confirm("Desea descargar el ticket de la cita?")){
        this.descargar_ticket(datuak);

      }
    } catch (error) {
      console.error("Error en generación de cita:", error);
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

  // Función: roundDownHour_hasieraData_crear
  // roundDownHour_hasieraData_crear() {
  //   const parts = this.hasOrduaTest.split(":");
  //   let hour = parseInt(parts[0], 10);
  //   let minute = parseInt(parts[1], 10);

  //   const roundedMinute = minute >= 45 ? "00" : minute >= 15 ? "30" : "00";
  //   const roundedHour = minute >= 45 ? hour + 1 : hour;
  //   this.hasOrduaTest = `${roundedHour.toString().padStart(2, "0")}:${roundedMinute}`;
  // }

  // // Función: roundDownHour_amaieraData_crear
  // roundDownHour_amaieraData_crear() {
  //   const parts = this.amaOrduaTest.split(":");
  //   let hour = parseInt(parts[0], 10);
  //   let minute = parseInt(parts[1], 10);

  //   const roundedMinute = minute >= 45 ? "00" : minute >= 15 ? "30" : "00";
  //   const roundedHour = minute >= 45 ? hour + 1 : hour;
  //   this.amaOrduaTest = `${roundedHour.toString().padStart(2, "0")}:${roundedMinute}`;
  // }

  // // Función: roundDownHour_hasieraData_editar
  // roundDownHour_hasieraData_editar() {
  //   const parts = this.hasOrduaTest.split(":");
  //   let hour = parseInt(parts[0], 10);
  //   let minute = parseInt(parts[1], 10);

  //   const roundedMinute = minute >= 45 ? "00" : minute >= 15 ? "30" : "00";
  //   const roundedHour = minute >= 45 ? hour + 1 : hour;
  //   this.hasOrduaTest = `${roundedHour.toString().padStart(2, "0")}:${roundedMinute}`;
  // }

  // // Función: roundDownHour_amaieraData_editar
  // roundDownHour_amaieraData_editar() {
  //   const parts = this.amaOrduaTest.split(":");
  //   let hour = parseInt(parts[0], 10);
  //   let minute = parseInt(parts[1], 10);

  //   const roundedMinute = minute >= 45 ? "00" : minute >= 15 ? "30" : "00";
  //   const roundedHour = minute >= 45 ? hour + 1 : hour;
  //   this.amaOrduaTest = `${roundedHour.toString().padStart(2, "0")}:${roundedMinute}`;
  // }  

}
