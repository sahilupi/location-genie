import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MaterialModule } from './modules/material/material.module';
import { SpaceComponent } from './components/space-components/space/space.component';
import { SpacesComponent } from './components/space-components/spaces/spaces.component';
import { LocationsComponent } from './components/location-components/locations/locations.component';
import { LocationComponent } from './components/location-components/location/location.component';
import { PopularLocationsComponent } from './components/popular-location-components/popular-locations/popular-locations.component';
import { PopularLocationComponent } from './components/popular-location-components/popular-location/popular-location.component';
import { EventLocationsComponent } from './components/event-location-components/event-locations/event-locations.component';
import { EventLocationComponent } from './components/event-location-components/event-location/event-location.component';
import { PopularDestinationsComponent } from './components/popular-destination-components/popular-destinations/popular-destinations.component';
import { PopularDestinationComponent } from './components/popular-destination-components/popular-destination/popular-destination.component';
import { ListingsComponent } from './components/listings-components/listings/listings.component';
import { ListingItemComponent } from './components/listings-components/listing-item/listing-item.component';
import { FindLocationComponent } from './components/find-location/find-location.component';
import { FilterPipe } from '../pipes/filter.pipe';
import { BannerComponent } from './components/banner/banner.component';
import { ProjectComponent } from './components/project/project.component';
import { EditSpaceComponent } from './edit-home-components/edit-space/edit-space.component';
import { EditPopularLocationComponent } from './edit-home-components/edit-popular-location/edit-popular-location.component';
import { EditHomeBannerComponent } from './edit-home-components/edit-home-banner/edit-home-banner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EditEventsComponent } from './edit-home-components/edit-events/edit-events.component';
import { EditHostBannerComponent } from './edit-become-host-components/edit-host-banner/edit-host-banner.component';
import { EditPhotoshootsComponent } from './edit-become-host-components/edit-photoshoots/edit-photoshoots.component';
import { EditTitleComponent } from './edit-home-components/edit-title/edit-title.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ListSpaceButtonsComponent } from './components/list-space-buttons/list-space-buttons.component';
import { ValidationMessageComponent } from './components/validation-message/validation-message.component';
import { ListingStepperComponent } from './components/listing-stepper/listing-stepper.component';
import { InputSpinnerComponent } from './components/input-spinner/input-spinner.component';
import { SquareSpinnerComponent } from './components/square-spinner/square-spinner.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { InputSelectComponent } from './components/input-select/input-select.component';
import { ListSpaceHeaderComponent } from './components/list-space-header/list-space-header.component';
import { CardDetailComponent } from './components/card-detail/card-detail.component';
import { SmoothHeightComponent } from './components/smooth-height/smooth-height.component';
import { HighlightPipe } from '../pipes/highlight.pipe';
import { TellUsPageComponent } from './components/tell-us-page/tell-us-page.component';

const routes: Route[] = [];
@NgModule({
  declarations: [
    // components
    SpaceComponent,
    SpacesComponent,
    LocationsComponent,
    LocationComponent,
    PopularLocationsComponent,
    PopularLocationComponent,
    EventLocationsComponent,
    EventLocationComponent,
    PopularDestinationsComponent,
    PopularDestinationComponent,
    ListingsComponent,
    ListingItemComponent,
    FindLocationComponent,
    BannerComponent,
    ProjectComponent,
    EditSpaceComponent,
    EditPopularLocationComponent,
    EditHomeBannerComponent,
    ConfirmDialogComponent,
    EditEventsComponent,
    EditHostBannerComponent,
    EditPhotoshootsComponent,
    EditTitleComponent,
    SpinnerComponent,
    ListSpaceButtonsComponent,
    ValidationMessageComponent,
    ListingStepperComponent,
    InputSpinnerComponent,
    SquareSpinnerComponent,
    OverlayComponent,
    InputSelectComponent,
    ListSpaceHeaderComponent,
    CardDetailComponent,
    SmoothHeightComponent,

    // pipes
    FilterPipe,
    HighlightPipe,
    TellUsPageComponent,
  ],

  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    CarouselModule,
  ],

  exports: [
    MaterialModule,
    CarouselModule,
    SpaceComponent,
    SpacesComponent,
    LocationsComponent,
    PopularLocationsComponent,
    EventLocationsComponent,
    PopularDestinationsComponent,
    ListingsComponent,
    FindLocationComponent,
    PopularLocationComponent,
    BannerComponent,
    ProjectComponent,
    ConfirmDialogComponent,
    SpinnerComponent,
    FilterPipe,
    SpinnerComponent,
    ListSpaceButtonsComponent,
    ValidationMessageComponent,
    ListingStepperComponent,
    InputSpinnerComponent,
    SquareSpinnerComponent,
    OverlayComponent,
    InputSelectComponent,
    ListSpaceHeaderComponent,
    CardDetailComponent,
    SmoothHeightComponent,
    FilterPipe,
    HighlightPipe,
  ],
})
export class SharedModule {}
