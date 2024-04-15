import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, Subscription } from 'rxjs';
import io from 'socket.io-client';
import { ChatDialogComponent } from '../chat-dialog/chat-dialog.component';
import { UsersService } from './users.service';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnInit, OnDestroy {
  apiURLUser=environment.apiUrl;
  
  private userList: any = [];
  private socket: any;
  private serverUrl = environment.serverUrl;
  private messageSubject = new Subject<any>();
  private messageSubscription: Subscription | any;
  private dialogOpenSet = new Set<string>();
  private messageObject=new Subject<any>();

  // private CurrentDateTime={}
  constructor(
    private HttpClient: HttpClient,
    private dialog: MatDialog,
    private chatDialog: MatDialog
  ) {
    console.log('SocketService constructor called.');
    this.connectToSocket();
    // this.setupMessageListener()
    // this.socket.on('receiveMessageFromUser', (data: any) => {
    //   console.log('Message received in SocketService:', data);
    //   this.messageSubject.next(data);
    // });
    // this.receiveMessageFromUser();
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchAllUsers();
      console.log(this.userList);
    }
    // this.currentDateAndTime()
    // this.openChatDialog('65aa96cef55a55e7b1d18f97');
  }
  ngOnInit(): void {
    // this.socket.on('receiveMessageFromUser', (data: any) => {
    //   console.log('Message received in SocketService:', data);
    //   // alert("mesage received")
    //   this.messageSubject.next(data);
    //   // this.openChatDialog(data.sender);
    // });
    // this.connectToSocket();
    // this.socket.on('receiveMessageFromUser', (data: any) => {
    //   // alert("mesage received")
    //   this.messageSubject.next(data);
    //     // this.openChatDialog(data.sender);
    // });
    //connect to socket start
    // const token = localStorage.getItem('token');
    // if (token) {
    //   try {
    //     this.socket = io(this.serverUrl, {
    //       auth: {
    //         token: token,
    //       },
    //     });
    //     // this.fetchAllUsers()
    //     // Handle socket events or perform additional setup here
    //     // this.setupSocketEvents();
    //   } catch (error) {
    //     console.error('Error connecting to socket:', error);
    //   }
    // } else {
    //   console.warn('Token is not available. Socket connection aborted.');
    // }
    //connect to socket end
    // this.connectToSocket();
    // this.receiveMessageFromUser()
    // this.receiveMessageFromUser().subscribe((data:any)=>{
    // this.chatDialog.open(ChatDialogComponent,{data:data})
    //   console.log("message Received")
    // })
    // this.socket.on('receiveMessageFromUser', (data: any) => {
    //   // observer.next(data);
    //   console.log('message received');
    // });
  }
  getdialogOpenSet(){
    return this.dialogOpenSet
  }
  getSocket() {
    return this.socket;
  }
  getmessageObject(){
    return this.messageObject.asObservable()
  }
  getMessageSubject() {
    console.log('message reached here');
    return this.messageSubject.asObservable();
  }

  getUsersList() {
    return this.userList;
  }
  fetchAllUsers() {
    this.HttpClient.get(`${this.apiURLUser}user/getUsers`).subscribe(
      (users: any) => {
        users.result.forEach((element: any) => {
          this.userList.push(element);
        });
        console.log(this.userList);
        // this.openChatDialog('65aa96cef55a55e7b1d18f97');
      }
    );
  }

  connectToSocket() {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        this.socket = io(this.serverUrl, {
          auth: {
            token,
          },
        });
  
        this.socket.on('connect', () => {

          //Automatically received message functionality takes many days to implement and at last I fixed it through the setupMessageListener method and calling it in the socket on connect 

          if (!this.messageSubscription) {
            console.log("setupMessageListener called")
            this.setupMessageListener();
          }
          // this.setupMessageListener();
          // Handle other connection-related tasks here
        });
  
        this.socket.on('disconnect', () => {
          // Handle disconnect events
        });
      } catch (error) {
        console.error('Error connecting to socket:', error);
      }
    } else {
      console.warn('Token is not available. Socket connection aborted.');
    }
  }
  

  disconnectFromSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  

  connectToUser(userId: string): void {
    this.socket.emit('connectToUser', userId);
  }

  joinGroup(groupId: string, groupMembers: any) {
    this.socket.emit(
      'getGroups',
      { groupId: groupId, groupMembers: groupMembers },
      (membersSocketIds: any) => {
        console.log('Received membersSocketIds from server:', membersSocketIds);
        // Do something with the received data on the client side
        membersSocketIds.forEach((socketId: any) => {
          this.socket.emit('joinGroup', {
            groupId: groupId,
            targetSocketId: socketId,
          });
        });
      }
    );
  }
  sendMessageToUser(targetUserId: string, message: string): void {
    this.socket.emit('sendMessageToUser', { targetUserId, message });
    // this.openChatDialog(targetUserId);
  }

  private setupMessageListener() {
  
    this.messageSubscription=this.socket.on(
      'receiveMessageFromUser',
      (data: any) => {
        console.log('Message received in SocketService:', data);
        const { dateNow, timeNow } = this.currentDateAndTime();

        const messageObj={
          sender:data.sender,
          message:data.message,
          date:dateNow,
          time:timeNow
        }

        if (!this.dialogOpenSet.has(data.sender)) {

          this.openChatDialog(data.sender,messageObj);
        this.messageObject.next(messageObj)

          console.log(messageObj)
          this.dialogOpenSet.add(data.sender); // Add to the set
        }else{
          console.log('dialog already opened')
          this.messageObject.next(messageObj)

        }
        
      }
    );
  }

  // receiveMessageFromUser(): Observable<string> {
  //   return new Observable((observer) => {
  //     this.socket.on('receiveMessageFromUser', (data: any) => {
  //       console.log('Message received in SocketService:', data);
  //       // alert("mesage received")
  //       observer.next(data);

  //       // this.openChatDialog(data.sender);
  //     });
  //   });
  // }

  receiveundeliverdmessage(userId: any) {
    return this.HttpClient.get(
      `${this.apiURLUser}messages/getMessages/${userId}`
    );
  }
  fetchGroupMembers(groupId: any) {
    return this.HttpClient.get(
      `${this.apiURLUser}groups/fetchGroupMembers/${groupId}`
    );
  }

  deleteMessageAfterSeen(messageId: any) {
    return this.HttpClient.delete(
      `${this.apiURLUser}messages/deleteSeenMessage/${messageId}`
    );
  }

  openChatDialog(userId: any ,messageObj:any) {
    const userArray = this.userList.filter((user: any) => user._id == userId);
    const user = userArray[0];
    console.log(user);

    if (this.dialogOpenSet.has(userId)) {
      console.log('Dialog already open for', userId);
      return; // Prevent opening the dialog
    }
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      disableClose: true,
      data: { user ,messageObj},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogOpenSet.delete(user._id)
     console.log(`dialogset: ${this.dialogOpenSet}`);

   });
  }

  currentDateAndTime() {
    // Create a new Date object
    const currentDate = new Date();

    // Get the current date
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const year = currentDate.getFullYear();

    // Get the current time
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the date and time
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    }`;
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }:${seconds < 10 ? '0' + seconds : seconds}`;

    // Display the result
    // console.log('Current Date:', formattedDate);

    // console.log('Current Time:', formattedTime);

    return {
      dateNow: formattedDate,
      timeNow: formattedTime,
    };
  }

  createGroup(groupName: string, createdBy: string, members: any) {
    const data = {
      groupName: groupName,
      createdBy: createdBy,
      members: members,
    };
    return this.HttpClient.post(
      `${this.apiURLUser}groups/createGroup`,
      data
    );
  }

  sendMessageToGroup(groupId: any, message: any) {
    this.socket.emit('sendMessageToGroup', { groupId, message });
  }

  // receiveMessageFromGroup(){

  //   this.socket.on('receiveMessageFromGroup', (data:any) => {
  //     const sender = data.sender;
  //     const message = data.message;

  //     // Handle the incoming group message, e.g., display it in the UI
  //     console.log(`Received message in group ${sender}: ${message}`);
  //   });
  // }

  receiveMessageFromGroup(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveMessageFromGroup', (data: any) => {
        observer.next(data);
      });
    });
  }

  deleteGroup(groupId: any) {
    return this.HttpClient.delete(
      `${this.apiURLUser}groups/deleteGroup/${groupId}`
    );
  }

  makeGroupAdmin(groupId: any, memberId: any) {
    const data = {
      memberId: memberId,
      groupId: groupId,
    };
    return this.HttpClient.post(
      `${this.apiURLUser}groups/makeGroupAdmin`,
      data
    );
  }

  removeGroupAdmin(groupId: any, memberId: any) {
    const data = {
      memberId: memberId,
      groupId: groupId,
    };
    return this.HttpClient.post(
      `${this.apiURLUser}groups/removeGroupAdmin`,
      data
    );
  }

  leaveGroup(groupId: any, memberId: any) {
    const data = {
      groupId: groupId,
      memberId: memberId,
    };
    return this.HttpClient.post(
      `${this.apiURLUser}groups/leaveGroup`,
      data
    );
  }

  fetchGroupById(id: any) {
    return this.HttpClient.get(
      `${this.apiURLUser}groups/fetchGroupsById/` + id
    );
  }

  ngOnDestroy() {
    // Unsubscribe from the message listener when the service is destroyed
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
