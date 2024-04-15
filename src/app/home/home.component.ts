import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../Services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  loginStatus = false;
  private LoginStatusListener!: Subscription;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    console.log("home component got initialized")
    // this.loginStatus = this.userService.getloginStatus();
    this.userService.getauthStatusListener().subscribe((status) => {
      this.loginStatus = status;
      console.log(status);
    });
    console.log(this.loginStatus)
  }
  ngOnDestroy(): void {
    // this.LoginStatusListener.unsubscribe();
  }

  openFriendsList(){
    this.userService.openFriendsModal()
    console.log("button is working")
  }
}
