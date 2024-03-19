import { Component, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-list-space-wrapper',
  template: '<router-outlet></router-outlet>',
})
export class ListSpaceWrapperComponent implements OnDestroy {
  constructor(private sharedService: SharedService) {
    this.sharedService.setHideHeader(true);
  }

  ngOnDestroy(): void {
    this.sharedService.setHideHeader(false);
  }
}
