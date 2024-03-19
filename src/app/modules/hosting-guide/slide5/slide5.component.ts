import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide5',
  templateUrl: './slide5.component.html',
  styleUrls: ['./slide5.component.scss'],
})
export class Slide5Component {
  step: string;
  constructor(private router: Router) {}

  ngOnInit() {
    this.step = this.router.url.split('/')[3].split('-')[1];
  }
}
