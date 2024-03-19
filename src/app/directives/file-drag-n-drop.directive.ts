import {
  Directive,
  HostListener,
  HostBinding,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

@Directive({
  selector: '[fileDragDrop]',
})
export class FileDragNDropDirective {
  @Input() sendReq: boolean = false;
  //@Input() private allowed_extensions : Array<string> = ['png', 'jpg', 'bmp'];

  @Output() private filesChangeEmiter: EventEmitter<File[]> =
    new EventEmitter();
  //@Output() private filesInvalidEmiter : EventEmitter<File[]> = new EventEmitter();
  @HostBinding('style.background') private background = 'transparent';
  @HostBinding('style.border') private borderStyle = '2px dashed';
  @HostBinding('style.border-color') private borderColor = 'transparent';
  @HostBinding('style.border-radius') private borderRadius = '5px';

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'rgb(0, 0, 0, 0.5)';
    this.borderColor = '#016670';
    this.borderStyle = '8px solid';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'transparent';
    this.borderColor = 'transparent';
    this.borderStyle = '2px dashed';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'transparent';
    this.borderColor = 'transparent';
    this.borderStyle = '2px dashed';
    let files = evt.dataTransfer.files;
    let valid_files: Array<File> = files;
    this.filesChangeEmiter.emit(valid_files);
  }
}
