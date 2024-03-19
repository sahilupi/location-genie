import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide2',
  templateUrl: './slide2.component.html',
  styleUrls: ['./slide2.component.scss'],
})
export class Slide2Component {
  step: string;
  constructor(private router: Router) {}

  ngOnInit() {
    this.step = this.router.url.split('/')[3].split('-')[1];
  }
}
