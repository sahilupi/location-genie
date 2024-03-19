import { Component } from '@angular/core';
@Component({
  selector: 'app-location-genie-work',
  templateUrl: './location-genie-work.component.html',
  styleUrls: ['./location-genie-work.component.scss'],
})
export class LocationGenieWorkComponent {
  breadcrumbs = [
    {
      label: 'Home',
      url: '',
    },
    {
      label: 'Location Genie Work',
      url: '/location-genie-work',
    },
  ];
}
