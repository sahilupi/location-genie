import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide6',
  templateUrl: './slide6.component.html',
  styleUrls: ['./slide6.component.scss'],
})
export class Slide6Component {
  step: string;
  constructor(private router: Router) {}

  ngOnInit() {
    this.step = this.router.url.split('/')[3].split('-')[1];
  }
}
