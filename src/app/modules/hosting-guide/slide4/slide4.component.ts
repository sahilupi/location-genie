import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide4',
  templateUrl: './slide4.component.html',
  styleUrls: ['./slide4.component.scss'],
})
export class Slide4Component {
  step: string;
  constructor(private router: Router) {}

  ngOnInit() {
    this.step = this.router.url.split('/')[3].split('-')[1];
  }
}
