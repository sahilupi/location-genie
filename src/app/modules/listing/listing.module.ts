import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import {
  provideEnvironmentNgxMask,
  IConfig,
  NgxMaskDirective,
  NgxMaskPipe,
} from 'ngx-mask';
import { ListingRoutingModule } from './listing-routing.module';
import { ListingDetailsComponent } from './listing-details/listing-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GalleryModelComponent } from './gallery-model/gallery-model.component';
import { RequestBookingComponent } from './request-booking/request-booking.component';
import { AttendiesDropdownComponent } from './attendies-dropdown/attendies-dropdown.component';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [
    ListingDetailsComponent,
    GalleryModelComponent,
    RequestBookingComponent,
    AttendiesDropdownComponent,
  ],
  imports: [
    CommonModule,
    ListingRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CarouselModule,
    GalleryModule,
    LightboxModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(environment.stripePK),
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [DatePipe, provideEnvironmentNgxMask(maskConfig)],
})
export class ListingModule {}
