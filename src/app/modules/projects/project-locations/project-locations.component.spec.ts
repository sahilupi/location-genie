import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLocationsComponent } from './project-locations.component';

describe('ProjectLocationsComponent', () => {
  let component: ProjectLocationsComponent;
  let fixture: ComponentFixture<ProjectLocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectLocationsComponent]
    });
    fixture = TestBed.createComponent(ProjectLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
