import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]',
  standalone: true
})
export class DndDirective {

  constructor() { }

  @HostBinding('class.fileOver') fileOver: boolean;

  @Output() fileDropped = new EventEmitter<any>();

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
    evt.preventDefault();
    evt.stopPropagation();

    this.fileOver = true;

    console.log('dragover');
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: { preventDefault: () => void; stopPropagation: () => void; }) {
    evt.preventDefault();
    evt.stopPropagation();

    this.fileOver = false;

    console.log('dragleave');
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: { files: any; }; }) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    this.fileOver = false;
    if (files.length > 0) {
      this.fileDropped.emit(files)
      console.log('Dropped files', files);
    }
  }
}
