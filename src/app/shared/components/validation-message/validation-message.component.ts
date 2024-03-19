import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss'],
})
export class ValidationMessageComponent {
  @Input({ required: true })
  message = `A published listing should have at least one activity. Please choose how
guests will use your location.`;
}
