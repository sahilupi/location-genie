import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-space-buttons',
  templateUrl: './list-space-buttons.component.html',
  styleUrls: ['./list-space-buttons.component.scss'],
})
export class ListSpaceButtonsComponent {
  @Input({ required: true }) backBtnRoute: string;
  @Input() nextBtnText: string = 'Next';
  @Input() backBtnText: string = 'Back';
  @Input() nxtBtnRoute: string;
  @Input() disabledNxtBtn: boolean;
  @Input({ required: true }) progressValue: number = 10;

  @Output() nextBtnClick = new EventEmitter();

  onNextBtnClick(): void {
    this.nextBtnClick.emit(null);
  }
}
