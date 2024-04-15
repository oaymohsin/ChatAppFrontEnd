import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatDialogComponent } from './group-chat-dialog.component';

describe('GroupChatDialogComponent', () => {
  let component: GroupChatDialogComponent;
  let fixture: ComponentFixture<GroupChatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupChatDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupChatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
