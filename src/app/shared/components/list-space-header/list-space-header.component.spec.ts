import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpaceHeaderComponent } from './list-space-header.component';

describe('ListSpaceHeaderComponent', () => {
  let component: ListSpaceHeaderComponent;
  let fixture: ComponentFixture<ListSpaceHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSpaceHeaderComponent]
    });
    fixture = TestBed.createComponent(ListSpaceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
