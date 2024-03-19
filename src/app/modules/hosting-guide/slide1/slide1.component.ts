import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide1',
  templateUrl: './slide1.component.html',
  styleUrls: ['./slide1.component.scss'],
})
export class Slide1Component {
  step: string;
  constructor(private router: Router) {

  }

  ngOnInit() {
    this.step = this.router.url.split('/')[3].split('-')[1];
  }
}
