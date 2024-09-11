import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';

type Data = {
  col1: string;
  col2: string;
  col3: string;
};

@Component({
  selector: 'app-test1',
  standalone: true,
  imports: [],
  templateUrl: './test1.component.html',
  styleUrl: './test1.component.scss'
})
export class Test1Component {
 @ViewChild('dialogElement') dialogElement?: ElementRef;

  isDialogOpen = false;
  isOverlayTransparent = false;
  isDragging = false;
  offsetX: number = 0;
  offsetY: number = 0;

 constructor(http: HttpClient){
   http.get<Data[]>("/data.json").subscribe(
     data => this.tableData = data
   );
 }

 tableData:Data[] = [];

  openDialog() {
    this.isDialogOpen = true;
    this.isOverlayTransparent = false;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.isOverlayTransparent = false;
  }

  makeOverlayTransparent(event: MouseEvent) {
    if (!this.isOverlayTransparent && event.target === event.currentTarget) {
      this.isOverlayTransparent = true;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onDialogMouseDown(event: MouseEvent) {
    this.isDragging = true;
    const dialogRect = this.dialogElement?.nativeElement.getBoundingClientRect();
    this.offsetX = event.clientX - dialogRect.left;
    this.offsetY = event.clientY - dialogRect.top;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const dialog = this.dialogElement?.nativeElement;
      dialog.style.left = `${event.clientX - this.offsetX}px`;
      dialog.style.top = `${event.clientY - this.offsetY}px`;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }
  makeOverlayOpaque(event: MouseEvent) {
    if (this.isOverlayTransparent) {
      this.isOverlayTransparent = false;
      event.stopPropagation();
    }
  }
}
