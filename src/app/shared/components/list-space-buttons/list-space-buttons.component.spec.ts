import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpaceButtonsComponent } from './list-space-buttons.component';

describe('ListSpaceButtonsComponent', () => {
  let component: ListSpaceButtonsComponent;
  let fixture: ComponentFixture<ListSpaceButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSpaceButtonsComponent]
    });
    fixture = TestBed.createComponent(ListSpaceButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
