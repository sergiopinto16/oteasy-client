
import React from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";



const addFooters = doc => {
    const pageCount = doc.internal.getNumberOfPages()

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
            align: 'center'
        })
        doc.text('Developed by SPinto with reactjs - jsPDF', doc.internal.pageSize.width - 10, 287, {
            align: 'right'
        })

    }
}


const addHeaders = doc => {

    // Load the image
    //var image = new Image();
    //image.src = '../../static/images/logo_spm.jpg';


    const pageCount = doc.internal.getNumberOfPages()

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        //doc.addImage(image, 'JPEG', 10, 5, 60, 15);
        doc.text('SPM CASA', doc.internal.pageSize.width - 10, 10, {
            align: 'right'
        })

    }
}



export const spmPDF = () => {
    // const string = renderToString(<Prints />);
    const doc = new jsPDF("p", "mm", "a4");
    const columns = [
        "SOW Creation Date",
        "SOW Start Date",
        "Project",
        "Last Updated",
        "SOW End Date"
    ];
    var rows = [
        [
            "Dec 13, 2017",
            "Jan 1, 2018",
            "ABC Connect - ABCXYZ",
            "Dec 13, 2017",
            "Dec 31, 2018"
        ]
    ];
    // doc.fromHTML(string);

    var a4_width = 210;
    var a4_height = 297;
    // doc.text(20, 20, 'Hello world!');
    // doc.text(20, 30, 'This is client-side Javascript to generate a PDF.');

    var y = 20;
    // Load the image
    var image = new Image();
    image.src = '../../../static/images/logo_spm.jpg';
    doc.addImage(image, 'JPEG', 10, y - 10, 60, 15);


    /// TITLE
    y = y;
    doc.setFontSize(26);
    doc.setFont("Helvetica", "bold");
    doc.text('SPM CASA', doc.internal.pageSize.width / 2, y, { align: 'center' });

    /// CLIENT INFO
    y = y + 15;
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(20, y, "Nome: ");
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    // doc.text(45, y, document.getElementById("client_name").value);
    doc.text(45, y, 'NAME');


    y = y + 10;
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(20, y, "Idade: ");
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    // doc.text(45, y, document.getElementById("client_age").value);
    doc.text(45, y, '05');

    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(50, y, "Escolaridade: ");
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    // doc.text(90, y, document.getElementById("client_school_year").value);
    doc.text(90, y, '00');

    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(100, y, "Sexo: ");
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    // doc.text(120, y, document.getElementById("client_sex").value);
    doc.text(120, y, 'M');


    y = y + 10;
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(20, y, "Data: ");
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    // doc.text(45, y, document.getElementById("client_date_of_avaliation").value);
    doc.text(45, y, '2023-04-06');


    y = y + 10;
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text(20, y, "Motivo: ");
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");

    //var lineHeight = doc.internal.getLineHeight() * doc.internal.getFontSize();
    doc.setFontSize(12);
    var lineHeight = Math.max(doc.internal.getLineHeight(), doc.internal.getFontSize());
    var lineHeight = 12*0.4;
    console.log(doc.internal.getLineHeight());
    console.log(doc.internal.getFontSize());
    console.log(lineHeight);
    var maxHeight = a4_height - 40;

    y = y + 0;
    var x = 45;
    // var lines = doc.splitTextToSize(document.getElementById("client_avaliacion_reason").value, 150);
    var lines = doc.splitTextToSize("motivo em texto, exemplo", 150);
    for (var i = 0; i < lines.length; i++) {
        if (y + lineHeight > maxHeight) {
            doc.addPage();
            y = 10;
        }
        doc.text(lines[i], x, y);
        y = y + lineHeight;
    }
    //doc.text(30, 50, document.getElementById("client_avaliacion_reason").value);










    //Header and Fotter
    addFooters(doc);
    addHeaders(doc);

    // Get the data URL representation of the PDF
    var pdfData = doc.output("datauristring");
    // Open the PDF in a new window page
    var newWindow = window.open("");
    newWindow.document.write("<iframe width='100%' height='100%' src='" + pdfData + "'></iframe>");


    doc.save("pdf");
};