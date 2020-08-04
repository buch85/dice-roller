import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceBagNavigationComponent } from './dice-bag-navigation.component';

describe('DiceBagMainComponent', () => {
  let component: DiceBagNavigationComponent;
  let fixture: ComponentFixture<DiceBagNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiceBagNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceBagNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
