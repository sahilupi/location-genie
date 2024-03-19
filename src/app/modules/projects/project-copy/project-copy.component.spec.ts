import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCopyComponent } from './project-copy.component';

describe('ProjectCopyComponent', () => {
  let component: ProjectCopyComponent;
  let fixture: ComponentFixture<ProjectCopyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCopyComponent]
    });
    fixture = TestBed.createComponent(ProjectCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
