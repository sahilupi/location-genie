import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide3',
  templateUrl: './slide3.component.html',
  styleUrls: ['./slide3.component.scss'],
})
export class Slide3Component {
  step: string;
  constructor(private router: Router) {}

  ngOnInit() {
    this.step = this.router.url.split('/')[3].split('-')[1];
  }
}
