import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SocketService } from '../Services/socket.service';
import { UsersService } from '../Services/users.service';
import { Subscription } from 'rxjs';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-group-chat-dialog',
  templateUrl: './group-chat-dialog.component.html',
  styleUrls: ['./group-chat-dialog.component.css'],
})
export class GroupChatDialogComponent implements OnInit, OnDestroy {
  @ViewChild('receivedMessageTone') receivedMessageTone: any;
  group: any;
  groupMembers: any = [];
  message: any;
  chatMessages: any = [];
  myId: any;
  allUsers: any = [];
  private loggedInUserListener: Subscription | any;
  groupMemberButton: any = false;
  addGroupMembers: any = false;
  myUserDataObject: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { groupData: any },
    private SocketService: SocketService,
    private userService: UsersService,
    private matDialogRef: MatDialogRef<GroupChatDialogComponent>,
    private dialog: MatDialog
  ) {
    this.group = data.groupData;
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const groupMembers = this.group.members;
    groupMembers.forEach((member: any) => {
      console.log(member);
      if (member._id == userId) {
        this.myUserDataObject = member;
      }
    });
    // console.log(`ab dekho bhla ${this.userService.loggedUserId}`)
    // this.myId=this.userService.loggedUserId

    //this oberservable is not working dont know why
    this.loggedInUserListener = this.userService
      .getloggedInUserId()
      .subscribe((id) => {
        // this.myId=id;
        console.log(`My id is ${id}`);
      });

    this.myId = localStorage.getItem('userId');
    console.log(this.myId);

    this.SocketService.receiveMessageFromGroup().subscribe((data: any) => {
      if (data.groupId == this.group._id && data.senderId != this.myId) {
        this.chatMessages.push({
          type: 'received',
          message: data.message,
          person: data.sendername,
        });
        this.playReceivedMessageTone();
      }
    });
  }

  ngOnDestroy(): void {
    this.loggedInUserListener.unsubscribe();
  }

  playReceivedMessageTone() {
    // Check if the template reference variable is defined
    const playSentTone = () => {};

    if (this.receivedMessageTone) {
      // Access the native audio element using the template reference variable
      const audioElement: HTMLAudioElement =
        this.receivedMessageTone.nativeElement;

      // Check if the audio element is found and supported
      if (audioElement && typeof audioElement.play === 'function') {
        // Play the received message tone
        audioElement.play().catch((error) => {
          console.error('Error playing received message tone:', error);
        });
      }
    }
  }

  showGroupMembers(groupId: any) {
    this.SocketService.fetchGroupMembers(groupId).subscribe((result: any) => {
      this.groupMembers = result.members;
      // console.log(this.groupMembers)
    });
    this.groupMemberButton = true;
  }

  sendMessage(message: any, groupId: any) {
    this.chatMessages.push({
      type: 'sent',
      message: this.message,
      person: this.myUserDataObject.username,
    });
    this.SocketService.sendMessageToGroup(groupId, message);
  }

  deleteGroup(groupId: any) {
    this.SocketService.deleteGroup(groupId).subscribe((data: any) => {
      console.log(data);
      if (data.result == true) {
        this.matDialogRef.close();
      }
    });
  }

  makeAdmin(memberId: any, groupId: any) {
    this.SocketService.makeGroupAdmin(groupId, memberId).subscribe(
      (data: any) => {
        console.log(data.message);
        this.showGroupMembers(groupId);
        this.userService.alert(data.message)
        this.SocketService.fetchGroupById(groupId).subscribe((response: any) => {
          this.group = response.group;
        });
      }
    );
    
  }

  removeAdmin(memberId: any, groupId: any) {
    this.SocketService.removeGroupAdmin(groupId, memberId).subscribe(
      (data: any) => {
        console.log(data.message);
        this.showGroupMembers(groupId);
        this.userService.alert(data.message)

        this.SocketService.fetchGroupById(groupId).subscribe((response: any) => {
          this.group = response.group;
        });
      }
    );
    // this.group=data.groupData;
  }

  leaveGroup(groupId: any, userId: any) {
    this.SocketService.leaveGroup(groupId, userId).subscribe((data: any) => {
      console.log(data);
      this.showGroupMembers(groupId);
    });
  }

  fetchUsersList(groupId: any) {
    let groupMembersArray: any;

    // Fetch group members first
    this.SocketService.fetchGroupMembers(groupId).subscribe((result: any) => {
      groupMembersArray = result.members; // Assuming this is an array of objects like [{id: '1', name: 'User1'}, ...]

      // Now fetch all users
      this.userService.fetchAllUsers().subscribe((response: any) => {
        const allMembersArray = response.result; // Assuming this is an array of user objects like [{id: '1', name: 'User1'}, ...]

        // Filter to find all users that are not in group members array
        // this.allUsers = allMembersArray.filter((member: any) =>
        //   !groupMembersArray.some((groupMember: any) => groupMember.id === member.id)
        // );

        this.allUsers = allMembersArray.filter((member: any) => {
          // Check if the member is found in the groupMembersArray
          const isMember = !groupMembersArray.some((groupMember: any) => {
            const match = groupMember._id === member._id;
            console.log(
              `Checking ${member._id} against ${groupMember._id}: ${match}`
            );
            return match;
          });
          console.log(isMember);
          return isMember;
        });

        // console.log(`Group members array: `, groupMembersArray);
        // console.log(`All members array: `, allMembersArray);
        // console.log(`Filtered users not in group: `, this.allUsers);
        this.addGroupMembers = true;
      });
    });
  }

  addToGroup(userId: any, groupId: any) {
    this.userService
      .addUserToGroup(userId, groupId)
      .subscribe((Response: any) => {
        this.userService.alert(Response.message);
      });

    this.allUsers = this.allUsers.filter((user: any) => {
      return user._id !== userId;
    });
  }
}
