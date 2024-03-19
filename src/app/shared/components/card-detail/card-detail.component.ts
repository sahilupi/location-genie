import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent {
  @Input({ required: true }) brand: string = 'visa';
  @Input({ required: true }) cardNum: string = '8989';
  @Input({ required: true }) expMonth: number = 9;
  @Input({ required: true }) expYear: number = 26;
  @Input() id: string = '';
  @Input({ required: true }) cardHolderName: string = 'Manjeet Singh';
  @Input() showDeleteBtn: boolean = false;

  @Output() deleteCardEmitter: EventEmitter<string> = new EventEmitter();
  onDeleteCard(id: string): void {
    this.deleteCardEmitter.emit(id);
  }
}
