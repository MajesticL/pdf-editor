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
})


// Add editing tools
// addText
// setTool



// Add PDF Save

// Load original pdf into pdf lib

// Generates image from fabric.js canvas

// Embed image  into the PDF

// Draw image on top of original page

// Save/Download


// Helper for download