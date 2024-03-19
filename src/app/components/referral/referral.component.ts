import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss'],
})
export class ReferralComponent {
  constructor(private sharedService: SharedService) {
    // this.sharedService.setStickyHeader(true);
  }
}
