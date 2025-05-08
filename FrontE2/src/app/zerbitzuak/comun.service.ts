import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ComunService {

  constructor() { }

  descargar_ticket(datuak: any) {
    const pdf = new jsPDF();
    const margenIzquierdo = 10;
    let posicionY = 20;
  
    // 🔍 Cargar las imágenes de los logos
    const logoPeluqueria = new Image();
    logoPeluqueria.src = 'assets/IMP_Logotipoa.png'; // Ruta local del logo (Asegúrate de tenerlo en assets)
    const logoSanturtzi = new Image();
    logoSanturtzi.src = 'assets/images-removebg-preview.png'; // Ruta local del logo (Asegúrate de tenerlo en assets)
  
    // 🔍 Dibujar los logos cuando se cargan
    logoPeluqueria.onload = () => {
      pdf.addImage(logoPeluqueria, 'PNG', 10, 10, 40, 30);
      logoSanturtzi.onload = () => {
        pdf.addImage(logoSanturtzi, 'PNG', 170, 10, 25, 25);
  
        // 🔹 Título del ticket, más centrado y con más espacio
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text("Ticket de Cita", 80, 35); // Ahora está en la posición 35 para que quede más abajo

        // 🔹 Línea divisoria con más espacio vertical
        pdf.setDrawColor(0, 102, 204);
        pdf.setLineWidth(0.5);
        pdf.line(10, 50, 200, 50); // Bajé la línea divisoria a posición 50

        // 🔹 Información de la cita
        posicionY = 60; // Empezamos más abajo
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Data: ${datuak.data}`, margenIzquierdo, posicionY);
        posicionY += 7;
        pdf.text(`Hasiera Ordua: ${datuak.hasieraOrduaErreala}`, margenIzquierdo, posicionY);
        posicionY += 7;
        pdf.text(`Amaiera Ordua: ${datuak.amaieraOrduaErreala}`, margenIzquierdo, posicionY);
        posicionY += 7;
        pdf.text(`Langilea: ${datuak.langilea?.izena}`, margenIzquierdo, posicionY);
  
        // 🔹 Línea divisoria
        posicionY += 15;
        pdf.setDrawColor(0, 102, 204);
        pdf.line(10, posicionY, 200, posicionY);
        posicionY += 5;
  
        // 🔹 Tabla de servicios
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
  
        // 🔹 Total del precio
        posicionY = (pdf as any).lastAutoTable.finalY + 10;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(0, 102, 204);
        pdf.text(
          `PREZIO TOTALA: ${datuak.prezioTotala.toFixed(2)} €`,
          margenIzquierdo,
          posicionY
        );
  
        // 🔹 Guardar el PDF
        pdf.save(`ticket_${datuak.id}.pdf`);
      };
    };
  }  
}
