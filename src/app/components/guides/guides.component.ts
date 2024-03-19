import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    NgIf
  ]
})
export class GuidesComponent {

}
