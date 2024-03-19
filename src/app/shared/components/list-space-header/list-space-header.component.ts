import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-space-header',
  templateUrl: './list-space-header.component.html',
  styleUrls: ['./list-space-header.component.scss'],
})
export class ListSpaceHeaderComponent {
  @Input({ required: true }) stepNumber: number = 1;
  @Input({ required: true }) stepName: string = 'The basics';
  @Input() showSaveAndExit: boolean = true;

  @Output() onSaveAndExit = new EventEmitter<null>();

  onClickSave(): void {
    this.onSaveAndExit.emit(null);
  }
}
