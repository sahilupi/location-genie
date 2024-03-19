import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostListingRoutingModule } from './host-listing-routing.module';
import { HostListingsComponent } from './host-listings/host-listings.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [HostListingsComponent],
  imports: [CommonModule, HostListingRoutingModule, SharedModule],
})
export class HostListingModule {}
