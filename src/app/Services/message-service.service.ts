import { Injectable, OnInit } from '@angular/core';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService implements OnInit {
  // private receivedMessage = new Subject<any>();

  constructor(private socketService:SocketService) { 
    // this.socketService.receiveMessageFromUser().subscribe((data:any)=>{
    //   this.receivedMessage.next(data)
    // })
  }

  ngOnInit(): void {
    // this.socketService.receiveMessageFromUser().subscribe((data:any)=>{
    //   this.receivedMessage.next(data)
    // })
  }
  
  getReceiveMessage(){
    // console.log('Subscribed to receivedMessage in MessageService');
    // return this.receivedMessage.asObservable()
  }
}
