import {
  ElementRef,
  HostBinding,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-smooth-height',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  animations: [
    trigger('grow', [
      transition('void <=> *', []),
      transition(
        '* <=> *',
        [
          style({ height: '{{startHeight}}px', overflow: 'hidden' }),
          animate('.5s ease'),
        ],
        { params: { startHeight: 0 } }
      ),
    ]),
  ],
})
export class SmoothHeightComponent implements OnChanges {
  @Input() trigger: string;

  startHeight: number;

  constructor(private element: ElementRef) {}

  @HostBinding('@grow') get grow() {
    return { value: this.trigger, params: { startHeight: this.startHeight } };
  }

  setStartHeight() {
    this.startHeight = this.element.nativeElement.clientHeight;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setStartHeight();
  }
}
