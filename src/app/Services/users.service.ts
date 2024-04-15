import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogueComponent } from '../confirm-dialogue/confirm-dialogue.component';
import {environment} from 'environments/environment'
@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnInit {

  apiURLUser=environment.apiUrl;
  private loginStatus = false;
  token: any = '';
  tokenTimer: any;
  loggedUserId: any;
  private confirmDialogResponse= new Subject<boolean> 
  // private authStatusListener = new Subject<boolean>();
  private authStatusListener = new BehaviorSubject<boolean>(false);
  private loggedInUserId = new Subject<any>();
  //for opening friends modal from different component
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();
  //DECODE TOKEN AND EXTRACT PAYLOAD
  private tokenData= new BehaviorSubject<any>('');
  TokenData = this.tokenData.asObservable()


  constructor(
    private HttpClient: HttpClient,
    private socketService: SocketService,
    private router: Router,
    private snackBar: MatSnackBar,
    private confirmDialog:MatDialog
  ) {}

  ngOnInit(): void {
      this.decodeToken()
  }

  openFriendsModal() {
    this.isOpenSubject.next(true);
  }

  closeFriendsModal() {
    this.isOpenSubject.next(false);
  }




  getloginStatus() {
    return this.loginStatus;
  }
  getConfirmDialogListener(){
    return this.confirmDialogResponse.asObservable()
  }

  getloggedInUserId() {
    return this.loggedInUserId.asObservable();
  }
  getauthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(username: string, email: string, password: string) {
    const userData = {
      username: username,
      email: email,
      password: password,
    };
    return this.HttpClient.post(
      `${this.apiURLUser}user/signup`
      ,
      userData
    );
  }

  login(email: string, password: string) {
    const data = { email: email, password: password };

    this.HttpClient.post(
      `${this.apiURLUser}user/login`,
      data
    ).subscribe((response: any) => {
      if (response.token) {
        this.router.navigate(['/']);
        console.log(response.userId);
        this.loggedInUserId.next(response.userId);
        this.loggedUserId = response.userId;
        this.token = response.token;
        const expireInDuration = response.expiresIn;
        this.setAuthTimer(expireInDuration);
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expireInDuration * 1000
        );
        this.saveAuthData(this.token, expirationDate, response.userId);
        this.authStatusListener.next(true);
        this.socketService.connectToSocket();
        this.decodeToken()

        this.alert('User Logged In successfully')
       
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  logOut() {
    this.token = null;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.authStatusListener.next(false);
    this.socketService.disconnectFromSocket();
    this.router.navigate(['../']);
    this.tokenData.next(null)
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    console.log(authInformation);
    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.loginStatus = true;
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }

  fetchAllUsers() {
    return this.HttpClient.get(`${this.apiURLUser}user/getUsers`);
  }

  fetchMyGroups(id: any) {
    return this.HttpClient.get(
      `${this.apiURLUser}groups/getGroupsById/` + id
    );
  }

  alert(message:any){
    // this.snackBar.open('logged in successfully');
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: 5000, // Set duration in milliseconds
      data: { message: message },
      horizontalPosition: 'center', // Align horizontally
      verticalPosition: 'top' // Align vertically
    });
  }

  confirmation(data:any){
    // let result=false;
    const confirmDialogRef=this.confirmDialog.open(ConfirmDialogueComponent,{data:{
      heading:data.heading,
      okButton:data.okButton
    
    }})
    confirmDialogRef.afterClosed().subscribe((data:any)=>{
      if(data){
        this.confirmDialogResponse.next(true)
      }
      confirmDialogRef.close()
    })
  }
  
  decodeToken(){
    const token = localStorage.getItem('token');
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenDecode)
      this.tokenData.next(tokenDecode)
    }
  }

  addUserToGroup(memberId:any,groupId:any){
    const userData={
      memberId,
      groupId
    }
    return this.HttpClient.post(
      `${this.apiURLUser}groups/addMemberToGroup`,
      userData
    );
  }
}
