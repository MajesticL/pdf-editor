pdfjsLib.GlobalWorkerOptions.workerSrc ='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs';

const fabricCanvas = new fabric.Canvas('fabric-canvas', { idDrawingMode: false});

let pdfDoc = null;
let pdfBytesOriginal = null;
let currentScale = 1.5;


// Add PDF Load
document.getElementById('pdf-upload').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if(!file) return;

    const arrayBuffer = await file.arrayBuffer();
    pdfBytesOriginal = arrayBuffer;

    const typedArray = new Uint8Array(arrayBuffer);
    pdfDoc = await pdfjsLib.getDocument(typedArray).promise; 

    renderPage(1);
});

async function renderPage(pageNum) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({scale: currentScale});

    const container = document.getElementById('canvas-container');
    container.style.width = viewport.width + 'px';
    container.style.height = viewport.height + 'px';

    const pdfCanvas = document.getElementById('pdf-canvas');
    const ctx = pdfCanvas.getContext('2d');
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    await page.render({canvas: ctx, viewport: viewport}).promise;
    
    fabricCanvas.setWidth(viewport.width);
    fabricCanvas.setHeight(viewport.height);
    fabricCanvas.renderAll();
}


// Add editing tools
// addText
// function addText() {
//     const text = new fabric.IText('Edit Me', { 
//         left: 100, 
//         top: 100, 
//         fontSize: 20,
//         fill: 'red' 
//     });
//     fabricCanvas.add(text)
// }
// // setTool
// function setTool(mode) {
//     if (mode === 'draw') {
//         fabricCanvas.isDrawingMode = true;
//         fabricCanvas.freeDrawingBrush.color = 'blue';
//         fabricCanvas.freeDrawingBrush.width = 3;
//     } else {
//         fabricCanvas.isDrawingMode = false;
//     }
// }


// Add PDF Save

// Load original pdf into pdf lib

// Generates image from fabric.js canvas

// Embed image  into the PDF

// Draw image on top of original page

// Save/Download


// Helper for download