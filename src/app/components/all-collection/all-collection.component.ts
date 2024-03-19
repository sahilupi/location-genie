import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-all-collection',
  templateUrl: './all-collection.component.html',
  styleUrls: ['./all-collection.component.scss'],
  standalone: true,
  imports: []
})
export class AllCollectionComponent {
  constructor(private sharedService: SharedService) {
    // this.sharedService.setStickyHeader(true);
  }
}
