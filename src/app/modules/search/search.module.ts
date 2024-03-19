import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

import { SearchLocationsComponent } from './search-locations/search-locations.component';
import { SearchRoutingModule } from './search-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchLocationsComponent],
  imports: [
    CommonModule,
    DatePipe,
    SearchRoutingModule,
    SharedModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SearchModule {}
