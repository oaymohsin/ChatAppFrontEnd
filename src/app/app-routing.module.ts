import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './Auth/login/login.component';
import { CreateGroupComponent } from './create-group/create-group.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"sign-up",component:SignUpComponent},
  {path:"login",component:LoginComponent},
  {path:"create-group",component:CreateGroupComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
