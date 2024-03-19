import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellUsPageComponent } from './tell-us-page.component';

describe('TellUsPageComponent', () => {
  let component: TellUsPageComponent;
  let fixture: ComponentFixture<TellUsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TellUsPageComponent]
    });
    fixture = TestBed.createComponent(TellUsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
