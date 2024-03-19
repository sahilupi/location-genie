import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalConstant } from 'src/app/constants/local-constant';
import { ListingStepThreeService } from 'src/app/services/listing-step-three.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-slide7',
  templateUrl: './slide7.component.html',
  styleUrls: ['./slide7.component.scss'],
})
export class Slide7Component implements OnInit {
  redirectUrl: string;
  step: string;

  constructor(
    private listingService: ListingStepThreeService,
    private localService: LocalService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.step = this.router.url.split('/')[3].split('-')[1];
    const response = await this.localService.getLocalData(
      LocalConstant.REDIRECT_URL
    );
    if (response) {
      this.redirectUrl = response;
    }
  }

  async onCompleteHosting(): Promise<void> {
    const response = await this.listingService.onCompleteHostingGuide(true);
    if (response && response.success) {
      if (this.redirectUrl) {
        await this.localService.removeLocalData(LocalConstant.REDIRECT_URL);
        this.router.navigateByUrl(this.redirectUrl);
      } else {
        this.router.navigateByUrl('/my-listings');
      }
    }
  }
}
