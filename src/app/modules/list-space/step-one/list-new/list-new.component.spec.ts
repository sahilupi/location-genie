import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNewComponent } from './list-new.component';

describe('ListNewComponent', () => {
  let component: ListNewComponent;
  let fixture: ComponentFixture<ListNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListNewComponent]
    });
    fixture = TestBed.createComponent(ListNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
