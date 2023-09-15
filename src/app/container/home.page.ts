import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../websocket-api.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  private context!: CanvasRenderingContext2D;
  private drawing: boolean = false;
  private drawingData: {x: number, y: number}[] = [];

  constructor(private ngZone: NgZone,private websocketService:WebsocketService) { }

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.initializeCanvas();
  }

  initializeCanvas() {
    this.context.strokeStyle = '#000000';
  }

  startDrawing(event: MouseEvent) {
    this.drawing = true;
    this.context.beginPath();
    this.context.moveTo(event.clientX - this.canvas.nativeElement.offsetLeft, event.clientY - this.canvas.nativeElement.offsetTop);
  }

  draw(event: MouseEvent) {
    if (!this.drawing) return;

    const x = event.clientX - this.canvas.nativeElement.offsetLeft;
    const y = event.clientY - this.canvas.nativeElement.offsetTop;
  
    this.drawingData.push({x, y});
  
    this.context.lineTo(x, y);
    this.context.stroke();
    this.websocketService.sendDrawingData(this.drawingData);
    this.websocketService.updateDrawingData(this.drawingData);
  }
  
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawingData = [];
  }
  showDrawingData() {
    console.log(this.drawingData);
  }
  drawReceivedData(data: {x: number, y: number}) {
    this.context.lineTo(data.x, data.y);
    this.context.stroke();
  }
  stopDrawing() {
    this.context.closePath();
    this.drawing = false;
  }

}
