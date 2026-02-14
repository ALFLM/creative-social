// This file contains functions related to the drawing functionality, including drawing on the canvas, changing colors, and shapes.

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let color = '#000000';
let lineWidth = 5;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
}

function draw(event) {
    if (!drawing) return;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

function changeColor(newColor) {
    color = newColor;
}

function changeLineWidth(newWidth) {
    lineWidth = newWidth;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);