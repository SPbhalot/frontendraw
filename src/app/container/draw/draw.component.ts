import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { WebsocketService } from '../../websocket-api.service';
@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent  {

  drawingData: {x: number, y: number}[] = [];
  @ViewChild('can', { static: true }) canvas!: ElementRef;
  drawing: any;
constructor(private drawingDataService: WebsocketService) {

  this.drawingDataService.drawingData$.subscribe(data => {
    this.drawing = data;
    this.redraw();
  });
}
redraw() {
  const canvas = this.canvas.nativeElement;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#000000';
  if (this.drawing.length < 2) return;
  context.beginPath();
  context.moveTo(this.drawing[0].x, this.drawing[0].y);
  for (let i = 1; i < this.drawing.length; i++) {
    context.lineTo(this.drawing[i].x, this.drawing[i].y);
    context.stroke();
  }
  context.closePath();
}

}
