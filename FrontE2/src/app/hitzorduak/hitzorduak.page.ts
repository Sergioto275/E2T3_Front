import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hitzorduak',
  templateUrl: './hitzorduak.page.html',
  styleUrls: ['./hitzorduak.page.scss'],
})
export class HitzorduakPage implements OnInit {
  
  startHour: string = '10:00:00';
  endHour: string = '16:00:00';
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
  dataSelec: any = null;
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
  error: boolean = false;
  environment: string = 'http://localhost'; // O la URL de tu API

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use(this.currentLocale);
  }

  ngOnInit() {
    this.cargarHitzordu();
  }

  retroceder() { 
    window.history.back(); 
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

  changeLanguage(locale: string) {
    this.currentLocale = locale;
    localStorage.setItem('selectedLocale', locale); // Guardar en localStorage
  }

  today(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async cargarHitzordu() {
    try {
      const response = await fetch(`${this.environment}/public/api/hitzorduak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
  
      if (!response.ok) {
        throw new Error('Error al cargar citas');
      }
  
      const data = await response.json();
      this.hitzorduArray = data;
      console.log('Citas cargadas:', this.hitzorduArray);
    } catch (error) {
      this.error = true;
      console.error("Error al cargar las citas:", error);
    }
  }

  cargar_cita_selec(id: string) {
    const cita = this.hitzorduArray.filter(citas => citas.id === id);
    this.idSelec = id;
    this.dataEditar = cita[0].data;
    this.hasOrduaEditar = cita[0].hasiera_ordua;
    this.amaOrduaEditar = cita[0].amaiera_ordua;
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

  async editar_cita() {
    try {
      const etxeko = this.etxekoEditar ? "E" : "K";
      const json_data = {
        "id": this.idSelec,
        "data": this.dataEditar,
        "hasiera_ordua": this.hasOrduaEditar,
        "amaiera_ordua": this.amaOrduaEditar,
        "eserlekua": this.eserlekuaEditar,
        "izena": this.izenaEditar,
        "telefonoa": this.telfEditar,
        "deskribapena": this.deskEditar,
        "etxekoa": etxeko
      };
  
      const response = await fetch(`${this.environment}/public/api/hitzorduak`, {
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

  async eliminar_cita() {
    try {
      const json_data = { "id": this.idSelec };
  
      const response = await fetch(`${this.environment}/public/api/hitzorduak`, {
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

  async asignar_cita() {
    try {
      const json_data = {
        "id": this.idSelec,
        "id_langilea": this.idLangile
      };
  
      const response = await fetch(`${this.environment}/public/api/hitzorduesleitu`, {
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
      const json_data = {
        "id": this.idSelec,
        "prezio_totala": prezio_totala
      };
      const response = await fetch(`${this.environment}/public/api/hitzorduaamaitu`, {
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
      await this.cargarHitzordu();
    } catch (error) {
      console.error("Error en generación de cita:", error);
    }

    // Crear ticket
    try {
      const json_data = {
        "id_hitzordu": this.idSelec,
        "tratamendua": this.tratamenduSelec
      };

      const response = await fetch(`${this.environment}/public/api/ticket_lerro`, {
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

      // toastr.success(this.translations[this.currentLocale].default.actualizar);
      // toastr.info(this.translations[this.currentLocale].citas.precioMessage + prezio_totala);

      for (let tratamendu of this.tratamenduSelec) {
        const tratamiento = this.tratamenduArray.filter(element => element.id == tratamendu.tratamendu_id);
        const kategoria = this.tratamenduKategoria.filter(el => el.id == tratamiento[0].id_katTratamendu);

        if (kategoria[0].kolorea === 's') {
          // toastr.warning(this.translations[this.currentLocale].citas.registrarCliente);
          if (confirm(this.translations[this.currentLocale].citas.redireccionCliente)) {
            window.location.href = 'BezeroFitxak.html';
          } else {
            this.cargarHitzordu();
          }
          break; // Detener el bucle si se redirige
        }
      }

      this.limpiar_campos();
    } catch (error) {
      console.error("Error en generación de ticket:", error);
    }
  }

  // Función: cargarComboBox
  async cargarComboBox() {
    try {
      const response = await fetch(`${this.environment}/public/api/taldeak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }

      const datuak = await response.json();
      this.taldeArray = datuak.filter((talde:any) => !talde.ezabatze_data || talde.ezabatze_data === "0000-00-00 00:00:00");
    } catch (error) {
      console.error("Error cargando el listado de equipos:", error);
    }

    try {
      const response = await fetch(`${this.environment}/public/api/langileak`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (!response.ok) {
        throw new Error('Errorea eskaera egiterakoan');
      }

      const datuak = await response.json();
      this.langileArray = datuak.filter((langile:any) => 
        !langile.ezabatze_data && langile.kodea == this.idTalde ||
        (langile.ezabatze_data === "0000-00-00 00:00:00" && langile.kodea == this.idTalde)
      );
    } catch (error) {
      console.error("Error cargando el listado de trabajadores:", error);
    }

    // Llamar a la función que filtra los tratamientos por trabajador
    this.tratamenduByLangile();
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

  // Función: getCitasAtTimeAndSeat
  getCitasAtTimeAndSeat(time: string, seatId: number) {
    const filteredCitas = this.hitzorduArray.filter(cita =>
      cita.hasiera_ordua <= time && cita.amaiera_ordua > time && cita.eserlekua === seatId
    );
    return filteredCitas;
  }

  // // Función: cargarHitzordu
  // async cargarHitzordu() {
  //   this.hitzorduArray = [];
  //   this.hitzorduak = [];
  //   try {
  //     const response = await fetch(`${this.environment}/public/api/hitzorduak/`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Access-Control-Allow-Origin': '*'
  //       },
  //       method: "GET"
  //     });
  //     if (!response.ok) {
  //       throw new Error('Error al obtener las citas');
  //     }
  //     const datuak = await response.json();
  //     this.hitzorduak = datuak.filter(hitzordu => !hitzordu.ezabatze_data || hitzordu.ezabatze_data === "0000-00-00 00:00:00");
  //     const eguna = formatDate(this.dataSelec, 'yyyy-MM-dd', 'en-US');
  //     this.hitzorduArray = datuak.filter(hitzordu => 
  //       (!hitzordu.ezabatze_data || hitzordu.ezabatze_data === "0000-00-00 00:00:00") && hitzordu.data.includes(eguna)
  //     );
  //   } catch (error) {
  //     console.log("Error al cargar citas:", error);
  //   }
  //   this.cargar_asientos();
  // }

  // Función: cargar_asientos
  async cargar_asientos() {
    try {
      const response2 = await fetch(`${this.environment}/public/api/langileak/count/${this.dataSelec}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });
      if (!response2.ok) {
        throw new Error('Error al obtener el número de asientos');
      }
      const datuak2 = await response2.json();
      this.eserlekuKop = [];
      const totalSeats = datuak2 <= 0 ? 20 : datuak2;
      for (let i = 1; i <= totalSeats; i++) {
        this.eserlekuKop.push({ id: i });
      }
    } catch (error) {
      console.log("Error al cargar los asientos:", error);
    }
  }

  // Función: cargar_dia_seleccionado
  cargar_dia_seleccionado() {
    const eguna = formatDate(this.dataSelec, 'yyyy-MM-dd', 'en-US');
    this.hitzorduArray = this.hitzorduak.filter(hitzordu => 
      (!hitzordu.ezabatze_data || hitzordu.ezabatze_data === "0000-00-00 00:00:00") && hitzordu.data.includes(eguna)
    );
    this.cargar_asientos();
  }

  // Función: getHoursInRange
  getHoursInRange() {
    const startTime = new Date(`2022-01-01 ${this.startHour}`);
    const endTime = new Date(`2022-01-01 ${this.endHour}`);
    this.hoursArray = [];

    while (startTime <= endTime) {
      const formattedHour = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.hoursArray.push(formattedHour);
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
  }

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
        data,
        hasOrdua,
        amaOrdua,
        eserlekua,
        izena,
        telefonoa,
        deskribapena,
        etxekoa: etxeko
      };

      const response = await fetch(`${this.environment}/public/api/hitzorduak`, {
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

  // Función: cargarTratamenduak
  async cargarTratamenduak() {
    try {
      const response = await fetch(`${this.environment}/public/api/tratamenduak`, {
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
      this.tratamenduArray = datuak.filter((tratamendua:any) => !tratamendua.ezabatze_data || tratamendua.ezabatze_data === '0000-00-00 00:00:00');
    } catch (error) {
      console.log("Error al cargar tratamientos:", error);
    }

    try {
      const response2 = await fetch(`${this.environment}/public/api/kategoriaTratamendu`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });

      if (!response2.ok) {
        throw new Error('Error al obtener categorías de tratamientos');
      }

      const datuak2 = await response2.json();
      this.tratamenduKategoria = datuak2.filter((katTratamendu:any) => !katTratamendu.ezabatze_data || katTratamendu.ezabatze_data === '0000-00-00 00:00:00');
    } catch (error) {
      console.log("Error al cargar categorías de tratamientos:", error);
    }
  }

  // Función para comprobar extras en una categoría de tratamiento
  comprobar_extras(id_kategoria: number): boolean {
    const kategoria = this.tratamenduKategoria.filter(katTratamendu => katTratamendu.id == id_kategoria);
    return kategoria.length > 0 && kategoria[0].extra === 's';
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

  // Función: lortuData
  lortuData(): string {
    const gaur = new Date();
    const urtea = gaur.getFullYear();
    let hilabetea = gaur.getMonth() + 1;
    let eguna = gaur.getDate();
    
    // if (eguna < 10) eguna = `0${eguna}`;
    // if (hilabetea < 10) hilabetea = `0${hilabetea}`;
    
    return `${urtea}-${hilabetea}-${eguna}`;
  }

   // Función: tratamenduByLangile
   async tratamenduByLangile() {
    try {
      const response = await fetch(`${this.environment}/public/api/tratamenduByLangile/${this.idTalde}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        method: "GET"
      });

      if (!response.ok) {
        throw new Error('Error al obtener tratamientos por trabajador');
      }

      const datuak = await response.json();
      this.langileTratamenduak = datuak;
      this.tratamenduKategoriaTaula = this.tratamenduKategoria.filter(kategoria => kategoria.extra === 'n');
    } catch (error) {
      console.log("Error al obtener tratamientos del trabajador:", error);
    }
  }

  // Función: getCantKategoria
  getCantKategoria(katId: number, lanId: number): string {
    const cant = this.langileTratamenduak.filter(tratamendu => tratamendu.langile_id === lanId && tratamendu.kategoria_id === katId);
    return cant.length > 0 ? cant[0].cant : "0";
  }

  // Función: cita_sartuta
  // cita_sartuta(time: string, seatId: number): boolean {
  //   if (time === this.hoursArray[0] && seatId === this.eserlekuKop[0].id) {
  //     this.rowspanAux = [];
  //   }

  //   const filteredCitas = this.hitzorduArray.filter(cita => 
  //     cita.hasiera_ordua <= time && cita.amaiera_ordua > time && cita.eserlekua === seatId
  //   );

  //   if (filteredCitas.length <= 0) {
  //     return true;
  //   }

  //   const citaID = filteredCitas[0].id;
  //   return !this.rowspanAux.includes(citaID);
  // }

  // // Función: rowspanManagement
  // rowspanManagement(time: string, seatId: number): number {
  //   if (time === this.hoursArray[0] && seatId === this.eserlekuKop[0].id) {
  //     this.rowspanAux = [];
  //   }

  //   const filteredCitas = this.hitzorduArray.filter(cita => 
  //     cita.hasiera_ordua <= time && cita.amaiera_ordua > time && cita.eserlekua === seatId
  //   );

  //   if (filteredCitas.length <= 0) {
  //     return 1;
  //   }

  //   const citaID = filteredCitas[0].id;
  //   let cant = 0;
  //   this.rowspanAux.push(citaID);

  //   this.hoursArray.forEach(element => {
  //     if (filteredCitas[0].hasiera_ordua <= element && filteredCitas[0].amaiera_ordua > element) {
  //       cant++;
  //     }
  //   });

  //   return cant;
  // }

  // Función: comprobar_cita_editar
  comprobar_cita_editar() {
    const eguna = new Date(this.dataEditar).toISOString().substring(0, 10);
    const filtrarCitas = this.hitzorduak.filter(cita => 
      ((cita.hasiera_ordua >= this.hasOrduaEditar && cita.hasiera_ordua < this.amaOrduaEditar) || 
      (cita.amaiera_ordua >= this.hasOrduaEditar && cita.amaiera_ordua < this.amaOrduaEditar)) && 
      cita.eserlekua === this.eserlekuaEditar && cita.data.includes(eguna)
    );

    if (filtrarCitas.length > 0) {
      this.error = true;
      // this.toastr.error(this.translations[this.currentLocale].default.citaReservada);
    } else {
      this.error = false;
    }
  }

  // Función: comprobar_cita_crear
  comprobar_cita_crear() {
    const eguna = new Date(this.dataTest).toISOString().substring(0, 10);
    const filtrarCitas = this.hitzorduak.filter(cita => 
      ((cita.hasiera_ordua >= this.hasOrduaTest && cita.hasiera_ordua < this.amaOrduaTest) || 
      (cita.amaiera_ordua >= this.hasOrduaTest && cita.amaiera_ordua < this.amaOrduaTest)) && 
      cita.eserlekua === this.eserlekuaCrear && cita.data.includes(eguna)
    );

    if (filtrarCitas.length > 0) {
      this.error = true;
      // this.toastr.error(this.translations[this.currentLocale].default.citaReservada);
    } else {
      this.error = false;
    }
  }

  // Función: checkCookie
  checkCookie() {
    if (document.cookie === "") {
      window.location.href = "http://localhost/Erronka2/Front/Login.html";
    } else if (document.cookie === "lanbide") {
      window.location.href = "http://localhost/Erronka2/Front/Home.html";
    }
  }

}
