import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hitzorduak',
  templateUrl: './hitzorduak.page.html',
  styleUrls: ['./hitzorduak.page.scss'],
})
export class HitzorduakPage implements OnInit {
  
  startHour: string = '10:00:00';
  endHour: string = '16:00:00';
  loading: boolean = true;
  serviciosSeleccionados: any[] = [];
  ordutegiak: any[] = [];
  gaurko_langileak: any [] = [];
  asientos!:number;
  hitzorduArray: any[] = [];
  hitzorduak: any[] = [];
  langile_asignado: string = 'nadie Asignado';
  generado: boolean = false;
  asignado: boolean = false;
  langileTratamenduak: any[] = [];
  tratamenduKategoria: any[] = [];
  tratamenduKategoriaTaula: any[] = [];
  precioextra: any = null;
  citasEditarArray: any[] = [];
  tratamenduArray: any[] = [];
  tratamenduSelec: any[] = [];
  taldeArray: any[] = [];
  langileArray: any[] = [];
  eserlekuKop: any[] = [];
  hoursArray: any[] = [];
  rowspanAux: any[] = [];
  idLangile: any = null;
  idTalde: any = null;
  dataTest: any = null;
  citaSelec: any = null;
  idSelec: any = null;
  izenaSelec: any = null;
  hasOrduaTest: any = null;
  amaOrduaTest: any = null;
  eserlekuaCrear: any = null;
  eserlekuaEditar: any = null;
  izenaCrear: any = null;
  telfCrear: any = null;
  deskCrear: any = null;
  etxekoCrear: any = null;
  dataSelec!: any;
  dataEditar: any = null;
  hasOrduaEditar: any = null;
  amaOrduaEditar: any = null;
  izenaEditar: any = null;
  telfEditar: any = null;
  deskEditar: any = null;
  etxekoEditar: any = null;
  citasDisponible: any = null;
  currentLocale: string = 'es';
  translations: any = {}; // Aquí deberían ir las traducciones
  selectedLanguage: string = 'es';
  error: boolean = false;
  environment: string = 'http://localhost'; // O la URL de tu API

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.currentLocale);
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
    // this.cargar_asientos();
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
      console.log(this.tratamenduArray)
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
    if(this.langileArray.length == 0){
      this.langileArray = langileak[0].taldea.langileak;
    }
    this.asientos = langileak[0].taldea.langileak.length - 1;
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
    // console.log(time + " | " + seatId);

    if (time === this.hoursArray[0] && seatId === 1) {
      this.rowspanAux = [];
    }
    // console.log(this.hitzorduArray)
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
      const data = this.dataTest;
      const hasOrdua = this.hasOrduaTest;
      const amaOrdua = this.amaOrduaTest;
      const eserlekua = this.eserlekuaCrear;
      const izena = this.izenaCrear;
      const telefonoa = this.telfCrear;
      const deskribapena = this.deskCrear;
      const etxeko = this.etxekoCrear ? "E" : "K";

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

      // this.toastr.success(this.translations[this.currentLocale].default.crear);
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
      const etxeko = this.etxekoEditar ? "E" : "K";
      const json_data = {
        "id": this.idSelec,
        "data": this.dataEditar,
        "hasieraOrdua": this.hasOrduaEditar,
        "amaieraOrdua": this.amaOrduaEditar,
        "eserlekua": this.eserlekuaEditar,
        "izena": this.izenaEditar,
        "telefonoa": this.telfEditar,
        "deskribapena": this.deskEditar,
        "etxekoa": etxeko
      };
      console.log(JSON.stringify(json_data));
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
      // toastr.success(this.translations[this.currentLocale].default.actualizar);
      await this.cargarHitzordu();
      this.limpiar_campos();
    } catch (error) {
      console.error("Error al editar la cita:", error);
    }
  }

// ----------------------------------------------------------------- ELIMINAR DATOS -----------------------------------------------------------------

async eliminar_cita() {
  try {
    const json_data = { "id": this.idSelec };

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
    // toastr.success(this.translations[this.currentLocale].default.eliminar);
    await this.cargarHitzordu();
    this.limpiar_campos();
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
  }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  limpiar_campos() {
    this.langile_asignado = 'nadie Asignado';
    this.langileTratamenduak = [];
    this.tratamenduKategoriaTaula = [];
    this.precioextra = null;
    this.tratamenduSelec = [];
    this.langileArray = [];
    this.idLangile = null;
    this.idTalde = null;
    this.dataTest = null;
    this.citaSelec = null;
    this.idSelec = null;
    this.izenaSelec = null;
    this.hasOrduaTest = null;
    this.amaOrduaTest = null;
    this.eserlekuaCrear = null;
    this.eserlekuaEditar = null;
    this.izenaCrear = null;
    this.telfCrear = null;
    this.deskCrear = null;
    this.etxekoCrear = null;
    this.dataEditar = null;
    this.hasOrduaEditar = null;
    this.amaOrduaEditar = null;
    this.izenaEditar = null;
    this.telfEditar = null;
    this.deskEditar = null;
    this.etxekoEditar = null;
    this.citasDisponible = null;
  }

  today(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }  

  cargar_cita_selec(id: string) {
    const cita = this.hitzorduArray.filter(citas => citas.id === id);
    this.idSelec = id;
    this.dataEditar = cita[0].data;
    this.hasOrduaEditar = cita[0].hasieraOrdua;
    this.amaOrduaEditar = cita[0].amaieraOrdua;
    this.izenaSelec = cita[0].izena;
    this.izenaEditar = cita[0].izena;
    this.telfEditar = cita[0].telefonoa;
    this.deskEditar = cita[0].deskribapena;
    this.eserlekuaEditar = cita[0].eserlekua;
    this.etxekoEditar = cita[0].etxekoa === "E";
    if (cita[0].id_langilea) {
      this.langile_asignado = `${cita[0].kodea} - ${cita[0].l_izena}`;
      this.asignado = true;
    } else {
      this.langile_asignado = 'nadie Asignado';
      this.asignado = false;
    }
    this.generado = !!cita[0].prezio_totala;
  }

  actualizarServiciosSeleccionados(servicio:any, extra:boolean) {
    if (servicio.selected) {
      if (!extra) {
        servicio.precio = this.etxekoEditar ? servicio.etxekoPrezioa : servicio.kanpokoPrezioa;
      }
    }
    const index = this.serviciosSeleccionados.findIndex(s => s.id === servicio.id);
    if (servicio.selected && index === -1) {
      this.serviciosSeleccionados.push(servicio);
    } else if (!servicio.selected && index !== -1) {
      this.serviciosSeleccionados.splice(index, 1);
    }
    console.log(this.serviciosSeleccionados);
  }

  async asignar_cita() {
    try {
      const json_data = {
        "id": this.idSelec
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
      // toastr.success(this.translations[this.currentLocale].default.actualizar);
      await this.cargarHitzordu();
      this.limpiar_campos();
    } catch (error) {
      console.error("Error al asignar la cita:", error);
    }
  }

  // Función: generar_ticket
  async generar_ticket() {
    let prezio_totala = 0;

    // Calcular el precio total de los tratamientos seleccionados
    this.tratamenduSelec.forEach(tratamendu => {
      prezio_totala = Number(prezio_totala) + Number(tratamendu.prezioa);
    });

    // Actualizar cita con el precio total
    try {
      const json_data = this.serviciosSeleccionados.map(servicio => ({
        "hitzordua": {
          "id": this.idSelec 
        },
        "zerbitzuak": {
          "id": servicio.id 
        },
        "prezioa": servicio.precio
      }));
      console.log(JSON.stringify(json_data));
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

  
  // Función: seleccionar_citaCrear
  seleccionar_citaCrear(eserlekua: number, time: string) {
    if (this.dataTest) {
      if (this.dataTest !== this.dataSelec) {
        if (confirm("¿Desea cambiar el día?")) {
          this.dataTest = this.dataSelec;
          this.hasOrduaTest = time;
          this.amaOrduaTest = this.hoursArray[this.hoursArray.indexOf(time) + 1];
          this.eserlekuaCrear = eserlekua;
        }
      } else {
        if (this.eserlekuaCrear !== eserlekua) {
          if (confirm("¿Desea cambiar el asiento?")) {
            this.hasOrduaTest = time;
            this.amaOrduaTest = this.hoursArray[this.hoursArray.indexOf(time) + 1];
            this.eserlekuaCrear = eserlekua;
          }
        } else {
          if (this.hasOrduaTest < time) {
            this.amaOrduaTest = this.hoursArray[this.hoursArray.indexOf(time) + 1];
          } else {
            this.hasOrduaTest = time;
          }
        }
      }
    } else {
      this.dataTest = this.dataSelec;
      this.hasOrduaTest = time;
      this.amaOrduaTest = this.hoursArray[this.hoursArray.indexOf(time) + 1];
      this.eserlekuaCrear = eserlekua;
    }
  }

  // Función: roundDownHour_hasieraData_crear
  roundDownHour_hasieraData_crear() {
    const parts = this.hasOrduaTest.split(":");
    let hour = parseInt(parts[0], 10);
    let minute = parseInt(parts[1], 10);

    const roundedMinute = minute >= 45 ? "00" : minute >= 15 ? "30" : "00";
    const roundedHour = minute >= 45 ? hour + 1 : hour;
    this.hasOrduaTest = `${roundedHour.toString().padStart(2, "0")}:${roundedMinute}`;
  }

  // Función: roundDownHour_amaieraData_crear
  roundDownHour_amaieraData_crear() {
    const parts = this.amaOrduaTest.split(":");
    let hour = parseInt(parts[0], 10);
    let minute = parseInt(parts[1], 10);

    const roundedMinute = minute >= 45 ? "00" : minute >= 15 ? "30" : "00";
    const roundedHour = minute >= 45 ? hour + 1 : hour;
    this.amaOrduaTest = `${roundedHour.toString().padStart(2, "0")}:${roundedMinute}`;
  }

  // Función: roundDownHour_hasieraData_editar
  roundDownHour_hasieraData_editar() {
    const parts = this.hasOrduaTest.split(":");
    let hour = parseInt(parts[0], 10);
    let minute = parseInt(parts[1], 10);

    const roundedMinute = minute >= 45 ? "00" : minute >= 15 ? "30" : "00";
    const roundedHour = minute >= 45 ? hour + 1 : hour;
    this.hasOrduaTest = `${roundedHour.toString().padStart(2, "0")}:${roundedMinute}`;
  }

  // Función: roundDownHour_amaieraData_editar
  roundDownHour_amaieraData_editar() {
    const parts = this.amaOrduaTest.split(":");
    let hour = parseInt(parts[0], 10);
    let minute = parseInt(parts[1], 10);

    const roundedMinute = minute >= 45 ? "00" : minute >= 15 ? "30" : "00";
    const roundedHour = minute >= 45 ? hour + 1 : hour;
    this.amaOrduaTest = `${roundedHour.toString().padStart(2, "0")}:${roundedMinute}`;
  }  

}
