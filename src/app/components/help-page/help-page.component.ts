import { Component, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
  standalone: true,
  imports: []
})
export class HelpPageComponent implements OnDestroy {
  constructor(private sharedService: SharedService) {
    this.sharedService.setStickyHeader(true);
  }

  ngOnDestroy(): void {
    this.sharedService.setStickyHeader(false);
  }
}
