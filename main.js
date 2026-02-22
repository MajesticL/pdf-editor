document.addEventListener("DOMContentLoaded", function () {

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const fabricCanvas = new fabric.Canvas('fabric-canvas', { 
        isDrawingMode: false,
        selection: true
    });

    fabricCanvas.setBackgroundColor('transparent', fabricCanvas.renderAll.bind(fabricCanvas));

    let pdfDoc = null;
    let pdfBytesOriginal = null;
    let currentScale = 1.5;


    document.getElementById("add-text").addEventListener("click", addText);
    document.getElementById("draw-mode").addEventListener("click", () => setTool('draw'));
    document.getElementById("select-mode").addEventListener("click", () => setTool('select'));
    document.getElementById("clear").addEventListener("click", clearCanvas);
    document.getElementById("save").addEventListener("click", savePDF);

    // Add PDF Load
    document.getElementById('pdf-upload').addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if(!file) return;

        const arrayBuffer = await file.arrayBuffer();
        pdfBytesOriginal = arrayBuffer.slice(0);
        const typedArray = new Uint8Array(arrayBuffer);
        
        try {
            pdfDoc = await pdfjsLib.getDocument(typedArray).promise; 
        } catch(err) {
            console.error(err);
            alert("Error loading PDF. Make sure it is a valid PDF.");
        }
        
    });

    async function renderPage(pageNum) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({scale: currentScale});

        const container = document.getElementById('canvas-container');
        container.style.width = viewport.width + 'px';
        container.style.height = viewport.height + 'px';
        
        document.getElementById('fabric-canvas').width = viewport.width;
        document.getElementById('fabric-canvas').height = viewport.height;

        const pdfCanvas = document.getElementById('pdf-canvas');
        const ctx = pdfCanvas.getContext('2d');
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;

        await page.render({canvasContext: ctx, viewport: viewport}).promise;
        
        fabricCanvas.setWidth(viewport.width);
        fabricCanvas.setHeight(viewport.height);
        fabricCanvas.renderAll();
    }


    // Add editing tools
    // addText
    function addText() {
        const text = new fabric.IText('Edit Me', { 
            left: 100, 
            top: 100, 
            fontSize: 20,
            fill: 'red',
            fontFamily: 'Helvetica'
        });
        fabricCanvas.add(text)
        fabricCanvas.setActiveObject(text);

        setTool('select')

        console.log("Text added.")
    }
    // setTool
    function setTool(mode) {
        if (mode === 'draw') {
            fabricCanvas.isDrawingMode = true;
            fabricCanvas.freeDrawingBrush.color = 'blue';
            fabricCanvas.freeDrawingBrush.width = 5;
            alert("Draw Mode ON. Draw on the PDF.")
        } else {
            fabricCanvas.isDrawingMode = false;
        }
    }

    function clearCanvas() {
        fabricCanvas.getObjects().forEach(obj => {
            fabricCanvas.remove(obj);
        });
        fabricCanvas.renderAll();
    }


    // Add PDF Save
    async function savePDF() {
        if (!pdfBytesOriginal) {alert("Load a PDF first"); return;}
    // Load original pdf into pdf lib
        const { PDFDocument } = PDFLib;
        const pdfLibDoc = await PDFDocument.load(pdfBytesOriginal);
        const pages = pdfLibDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
    // Generates image from fabric.js canvas
        const dataUrl = fabricCanvas.toDataURL({
            format: 'png',
            multiplier: 1 / currentScale
        });
    // Embed image  into the PDF
        const pngImage = await pdfLibDoc.embedPng(dataUrl);
    // Draw image on top of original page
        firstPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
    // Save/Download
        const modifiedPdfBytes = await pdfLibDoc.save();
        download(modifiedPdfBytes, "edited-document.pdf", "application/pdf");
    }

    // Helper for download
    function download(data, filename, type) {
        const blob = new Blob([data], { type: type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a)
        a.click();
        window.URL.revokeObjectURL(url);
    }
});