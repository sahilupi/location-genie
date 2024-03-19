import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[noZeroInput]',
})
export class NoZeroInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputValue = this.el.nativeElement.value;

    // Prevent entering '0' at any position.
    if (inputValue === '0' && event.key === '0') {
      event.preventDefault();
    }

    // Prevent entering '0' as the first character.
    if (inputValue === '' && event.key === '0') {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputValue = this.el.nativeElement.value;

    // Remove leading zeros after entering '0' initially.
    if (inputValue.length > 1 && inputValue.charAt(0) === '0') {
      this.el.nativeElement.value = inputValue.slice(1);
    }
  }
}
