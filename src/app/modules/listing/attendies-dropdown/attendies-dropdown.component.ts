import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AttendiesDropdown } from 'src/app/models/location.model';

@Component({
  selector: 'app-attendies-dropdown',
  templateUrl: './attendies-dropdown.component.html',
  styleUrls: ['./attendies-dropdown.component.scss'],
})
export class AttendiesDropdownComponent {
  @Input({ required: true }) attendiesDropdown: AttendiesDropdown[];
  @Input({ required: true }) selectedAttendies: AttendiesDropdown;
  @Input({ required: true }) currency: string;

  @Output() selectedAttendiesEmitter = new EventEmitter<AttendiesDropdown>();

  showDropDown = false;

  onUpdateSelectedAttendies(attendies: AttendiesDropdown): void {
    this.selectedAttendies = attendies;
    this.selectedAttendiesEmitter.emit(this.selectedAttendies);
  }
}
