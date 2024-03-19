import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpaceWrapperComponent } from './list-space-wrapper.component';

describe('ListSpaceWrapperComponent', () => {
  let component: ListSpaceWrapperComponent;
  let fixture: ComponentFixture<ListSpaceWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSpaceWrapperComponent]
    });
    fixture = TestBed.createComponent(ListSpaceWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
