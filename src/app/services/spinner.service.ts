import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private showHideSpinner = new Subject<boolean>();

  show(): void {
    this.showHideSpinner.next(true);
  }

  hide(): void {
    this.showHideSpinner.next(false);
  }

  getSpinner(): Observable<boolean> {
    return this.showHideSpinner.asObservable();
  }
}
