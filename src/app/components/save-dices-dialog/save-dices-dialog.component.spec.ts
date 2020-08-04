import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDicesDialogComponent } from './save-dices-dialog.component';

describe('SaveDicesDialogComponent', () => {
  let component: SaveDicesDialogComponent;
  let fixture: ComponentFixture<SaveDicesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveDicesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
