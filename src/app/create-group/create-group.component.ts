import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SocketService } from '../Services/socket.service';
import { UsersService } from '../Services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
// @ViewChild ('groupform') groupform: any;
public groupform:FormGroup | any;
UsersList:any=[]

constructor( private userService:UsersService,
  private router:Router,
  public formBuilder: FormBuilder, private socketService:SocketService){}

ngOnInit(): void {
  this.groupFormModel()

 const usersArray=this.socketService.getUsersList()
this.UsersList=usersArray
// this.UsersList.push(usersArray)
// console.log(this.UsersList)

}

groupFormModel(){
  this.groupform=this.formBuilder.group({
    groupName:new FormControl(''),
    // createdBy:new FormControl(''),
    members:new FormControl('')
  })
}
createGroup(){
  // console.log(this.groupform.value)

  const createdBy:any=localStorage.getItem('userId')

  //Geting ids of members because we have to send ids in backend
  const membersId:any=[];
  this.groupform.value.members.forEach((element:any) => {
    membersId.push(element._id)
    
  })

  // If createdBy(admin) is not in members list then push it in members list
  if(!membersId.includes(createdBy)){
    membersId.push(createdBy)
  }

  const groupData={
    groupName:this.groupform.value.groupName,
    createdBy:createdBy,
    members:membersId
  }

  this.socketService.createGroup(groupData.groupName,groupData.createdBy,groupData.members).subscribe((data:any)=>{
    console.log(data)
    // sending group members as extra data with this emitter
    this.socketService.joinGroup(data.data._id,data.data.members)
    this.userService.alert(data.message)
    this.groupform.reset()
    this.router.navigate(['/'])
  })
  // console.log(groupData)
}

}