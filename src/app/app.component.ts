import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from './Services/users.service';
import { SocketService } from './Services/socket.service';
import { Subscription } from 'rxjs';
import { MessageServiceService } from './Services/message-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Client';
  private messageSubscription: Subscription | any;

  constructor(
    private messageService: MessageServiceService,
    private userService: UsersService,
    private SocketService: SocketService,
    
  ) {}

  ngOnInit(): void {
    console.log("app component initialized")
    this.userService.autoAuthUser();
    // const Socket=this.SocketService.getSocket()
    // console.log(Socket)
    // Socket.on('receiveMessageFromUser', (data: any) => {
    //   console.log('Message received in SocketService:', data);
    //   // alert("mesage received")
    //   // observer.next(data);

    //   // this.openChatDialog(data.sender);
    // });
    // /

    // this.SocketService.receiveMessageFromUser();
    // this.messageSubscription=this.SocketService.receiveMessageFromUser().subscribe((data:any)=>{
    //   this.userService.alert(`Message Received from ${data.sender}`)
    // })

    // this.messageSubscription = this.messageService
    //   .getReceiveMessage()
    //   .subscribe((data: any) => {
    //     // this.userService.alert(`hi Allah g message aa gya`);
    //     console.log('Received message in AppComponent:', data);
    //     console.log(`Received message from ${data.sender}`);
    //   });


    // this.SocketService.receiveMessageFromUser().subscribe((receivedData:any)=>{
    //   console.log(`receivedMEssage Data ${receivedData.message}`)
    //   // this.recievedMessages=receivedData.message

    // })
    // console

    const usersId = localStorage.getItem('userId');
    // this.SocketService.receiveundeliverdmessage(usersId).subscribe((data:any)=>{
    // if(data.result.sender==this.user._id){
    //   this.chatMessages.push({
    //     type: 'received',
    //     message: data.result.content,
    //     sender: data.result.sender,
    //   });
    // }
    // console.log(data)
    // })
  }
  ngOnDestroy(): void {
    // this.messageSubscription.unsubscribe();
  }
}
