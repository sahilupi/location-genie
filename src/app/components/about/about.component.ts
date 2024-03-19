import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [
    MaterialModule
  ]
})
export class AboutComponent { }
