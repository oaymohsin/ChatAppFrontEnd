import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UsersService } from '../Services/users.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ChatDialogComponent } from '../chat-dialog/chat-dialog.component';
import { SocketService } from '../Services/socket.service';
import { GroupChatDialogComponent } from '../group-chat-dialog/group-chat-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('friendButton') friendButtonRef: ElementRef | any;

  loginStatus: any = false;
  private confirmDialogSubs: Subscription | any;
  private authListenerSubs: Subscription | any;
  UsersList: any = [];
  openedDialogList: any = [];
  openedGroupDialogList: any = [];
  myGroups: any = [];
  myId: any;
  clickFriendButton: boolean = false;
  loggedInUserData:any;
  constructor(
    private userService: UsersService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private socketService: SocketService //  private confirmationService:ConfirmationService , //  private messageService:MessageService
  ) {}

  ngOnInit(): void {
    // console.log(this.userService.getloginStatus())

    this.userService.isOpen$.subscribe((friendmodal) => {
      this.clickFriendButton = friendmodal;
      console.log(`check the clickfrien button ${this.clickFriendButton}`);
      if (this.clickFriendButton) {
        const friendButton =
          this.elementRef.nativeElement.querySelector('#friendButton');

        const nativeElement = this.friendButtonRef.nativeElement;
        nativeElement.click();
      }
    });

    // this.fetchGroups()
    // this.fetchUsers()
    const myId = localStorage.getItem('userId');
    this.myId = myId;

    this.socketService.connectToSocket();
    this.loginStatus = this.userService.getloginStatus();

    this.authListenerSubs = this.userService
      .getauthStatusListener()
      .subscribe((Response) => {
        this.loginStatus = Response;
      });
    // console.log(this.loginStatus)
    // const token=localStorage.getItem("token")
    // if (token){
    //   this.loginStatus=true
    // }
    // console.log(this.loginStatus);
      this.userService.decodeToken()
    this.userService.TokenData.subscribe((tokenData)=>{
      console.log(tokenData)
      this.loggedInUserData=tokenData
    })
    
  }

  //   confirm1(event: Event) {
  //     this.confirmationService.confirm({
  //         target: event.target as EventTarget,
  //         message: 'Are you sure that you want to proceed?',
  //         header: 'Confirmation',
  //         icon: 'pi pi-exclamation-triangle',
  //         acceptIcon:"none",
  //         rejectIcon:"none",
  //         rejectButtonStyleClass:"p-button-text",
  //         accept: () => {
  //             this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
  //         },
  //         reject: () => {
  //             this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  //         }
  //     });
  // }

  logOut() {
    this.userService.logOut();
    // this.loginStatus=false;
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.confirmDialogSubs.unsubscribe();
  }

  fetchUsers() {
    this.userService.fetchAllUsers().subscribe((users: any) => {
      this.UsersList = users.result;
      // console.log(this.UsersList)
    });
  }

  openChatDialog(user: any) {
    const dialogPosition = { bottom: '170px', right: '20px' };

    if (this.openedDialogList.length > 0) {
      // Calculate the total horizontal offset based on existing dialogs
      let totalOffset = 0;
      for (let i = 0; i < this.openedDialogList.length; i++) {
        totalOffset += 560; // Adjust based on dialog width and spacing
      }
      dialogPosition.right = `${totalOffset}px`;
    }

    const dialogRef = this.dialog.open(ChatDialogComponent, {
      disableClose: true,
      width: '500', // Adjust as needed
      position: dialogPosition,
      hasBackdrop: false,
      data: { user },
    });
    const dialogSet = this.socketService.getdialogOpenSet();
    dialogSet.add(user._id);
    console.log(dialogSet);

    this.openedDialogList.push(user._id);

    dialogRef.afterClosed().subscribe((result) => {
      dialogSet.delete(user._id);
      console.log(`dialogset: ${dialogSet}`);
    });

    this.socketService.connectToUser(user._id);
  }

  createGroup() {}

  fetchGroups() {
    const myId = localStorage.getItem('userId');
    this.myId = myId;
    this.userService.fetchMyGroups(myId).subscribe((result: any) => {
      this.myGroups = result.data;

      console.log(this.myGroups);
    });
  }
  openGroupDialog(groupData: any) {
    console.log(groupData);
    const dialogPosition = { bottom: '170px', right: '20px' };

    if (this.openedGroupDialogList.length > 0) {
      // Calculate the total horizontal offset based on existing dialogs
      let totalOffset = 0;
      for (let i = 0; i < this.openedGroupDialogList.length; i++) {
        totalOffset += 560; // Adjust based on dialog width and spacing
      }
      dialogPosition.right = `${totalOffset}px`;
    }

    const dialogRef = this.dialog.open(GroupChatDialogComponent, {
      disableClose: true,
      width: '500', // Adjust as needed
      position: dialogPosition,
      hasBackdrop: false,
      data: { groupData },
    });

    this.openedGroupDialogList.push(groupData._id);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog Result: ${result}`);
      this.openedDialogList = this.openedDialogList.filter(
        (id: any) => id !== groupData._id
      );
    });

    // this.socketService.connectToUser(user._id);
  }

  deleteGroup(groupId: any, groupName: any) {
    const confirmData: any = {
      heading: `Are you Sure to delete ${groupName} group?`,
      okButton: 'Yes Delete!',
    };
    //Opening dialog box which ask for confirmation to delete
    this.userService.confirmation(confirmData);

    this.confirmDialogSubs = this.userService
      .getConfirmDialogListener()
      .subscribe((result: any) => {
        if (result) {
          this.socketService.deleteGroup(groupId).subscribe((data: any) => {
            console.log(data);
            if (data.result == true) {
              this.userService.alert(data.message);
              this.fetchGroups();
            }
          });
        }
      });
  }

  leaveGroup(groupId: any, userId: any, groupName: any) {
    const confirmData: any = {
      heading: `Are you Sure to leave ${groupName} group?`,
      okButton: 'Yes Leave!',
    };

    this.userService.confirmation(confirmData);

    this.confirmDialogSubs = this.userService
      .getConfirmDialogListener()
      .subscribe((result: any) => {
        if (result) {
          this.socketService
            .leaveGroup(groupId, userId)
            .subscribe((data: any) => {
              this.fetchGroups();
              console.log(data);
              this.userService.alert(data.message);
            });
        }
      });
  }

  falseButton(){
    this.userService.closeFriendsModal()
  }
}
