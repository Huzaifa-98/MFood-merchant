import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersUpsertComponent } from './users-upsert.component';

describe('UsersUpsertComponent', () => {
  let component: UsersUpsertComponent;
  let fixture: ComponentFixture<UsersUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersUpsertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
