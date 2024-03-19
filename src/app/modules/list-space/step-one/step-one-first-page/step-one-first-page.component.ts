import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MapInfoWindow } from '@angular/google-maps';
import { Router } from '@angular/router';
import { GeoLocationData } from 'src/app/constants/geolocations';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';

@Component({
  selector: 'app-step-one-first-page',
  templateUrl: './step-one-first-page.component.html',
  styleUrls: ['./step-one-first-page.component.scss'],
})
export class StepOneFirstPageComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  @Input() listingId: string;

  addressForm: FormGroup;
  center = GeoLocationData.center;
  marker = GeoLocationData.marker;
  zoom: number = 16;
  backBtnRoute: string;
  stepperData = ListingStepperConstant.stepOne;
  address: string;
  geocoder: google.maps.Geocoder;
  isLoaded = false;
  options = { ...GeoLocationData.options };
  mapDraggable = false;

  constructor(
    private router: Router,
    private listStepOneService: ListingStepOneService
  ) {}

  async ngOnInit(): Promise<void> {
    this.backBtnRoute = `/become-a-host/${+this.listingId}/step-1/address`;
    this.geocoder = new google.maps.Geocoder();
    await this.getListing(+this.listingId);
  }
  private async getListing(id: number): Promise<void> {
    const latLongResponse =
      await this.listStepOneService.getListingLocationLatAndLngByListingId(id);
    if (latLongResponse && latLongResponse.success && latLongResponse.data) {
      const lat = +latLongResponse.data.latitude;
      const lng = +latLongResponse.data.longitude;
      if (lat && lng) {
        this.marker.position.lat = lat;
        this.marker.position.lng = lng;
        this.center.lat = lat;
        this.center.lng = lng;
        this.updateOptions(lat, lng);
      }

      this.isLoaded = true;
    } else {
      const response = await this.listStepOneService.getListingAddress(id);
      if (
        response &&
        response.success &&
        response.data &&
        response.data.listingAddress
      ) {
        this.address = response.data.listingAddress.streetAddress;
        await this.getLatLngFromAddress(this.address);
        this.isLoaded = true;
      }
    }
  }

  async getLatLngFromAddress(address: string) {
    const geocoder = new google.maps.Geocoder();
    await geocoder.geocode({ address }, async (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        this.marker.position.lat = lat;
        this.marker.position.lng = lng;
        this.center.lat = lat;
        this.center.lng = lng;
        this.updateOptions(lat, lng);
      } else {
      }
    });
  }

  updateOptions(lat: number, lng: number, drag?: boolean): void {
    if (drag) {
      this.zoom = 17;
    } else {
      this.zoom = 16;
    }
    this.mapDraggable = drag ? true : false;
    this.options = {
      position: {
        lat: lat,
        lng: lng,
      },
      visible: true,
      opacity: 1,
      label: {
        color: ' ',
        text: ' ',
      },
      title: 'Drag to change location',
      icon: 'https://giggster.com/images/become-host-steps/map-pin-green.png',
      options: {
        draggable: drag ? true : false,
        animation: google.maps.Animation.DROP,
      },
    };
  }

  onMarkerDragEnd(event: any): void {
    this.marker.position.lat = event.latLng.lat();
    this.marker.position.lng = event.latLng.lng();
    this.center.lat = event.latLng.lat();
    this.center.lng = event.latLng.lng();
  }

  async onSaveAddress(flag?: string): Promise<void> {
    const data = {
      listingId: +this.listingId,
      longitude: String(this.marker.position.lng),
      latitude: String(this.marker.position.lat),
    };
    const response = await this.listStepOneService.updateListingLocationPinInfo(
      data
    );
    if (response && response.success) {
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${this.listingId}`);
      } else {
        this.router.navigateByUrl(
          `/become-a-host/${this.listingId}/step-1/location-type`
        );
      }
    }
  }
}
