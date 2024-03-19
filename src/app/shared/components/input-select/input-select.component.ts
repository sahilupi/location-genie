import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventList } from 'src/app/models/event.model';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
})
export class InputSelectComponent implements OnInit {
  @Input({ required: true }) eventsList: EventList[] = [];

  @Output('dataEmitter') dataEmitter = new EventEmitter<EventList>();

  showEventList: boolean = false;
  eventData: EventList = this.eventsList[0];
  searchForm: FormGroup;

  ngOnInit(): void {
    this.eventData = this.eventsList[0];
    this.searchForm = new FormGroup({
      name: new FormControl(this.eventData ? this.eventData.name : ''),
    });
  }

  onSelectEvent(event: EventList): void {
    this.eventData = event;
    this.dataEmitter.emit(this.eventData);
  }

  onFocusEvent(): void {
    this.showEventList = true;
    this.searchForm.patchValue({
      name: '',
    });
  }

  onBlurEvent(): void {
    this.showEventList = false;
    this.searchForm.patchValue({
      name: this.eventData ? this.eventData.name : '',
    });
  }
}
