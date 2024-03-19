import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCollectionComponent } from './all-collection.component';

describe('AllCollectionComponent', () => {
  let component: AllCollectionComponent;
  let fixture: ComponentFixture<AllCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllCollectionComponent],
    });
    fixture = TestBed.createComponent(AllCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
