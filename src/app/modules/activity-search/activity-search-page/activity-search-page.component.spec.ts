import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySearchPageComponent } from './activity-search-page.component';

describe('ActivitySearchPageComponent', () => {
  let component: ActivitySearchPageComponent;
  let fixture: ComponentFixture<ActivitySearchPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitySearchPageComponent]
    });
    fixture = TestBed.createComponent(ActivitySearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
