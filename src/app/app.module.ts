import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { FriendsComponent } from './friends/friends.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { SocketIoModule } from 'ngx-socket-io';
import { config } from 'rxjs';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { SocketService } from './Services/socket.service';
import { UsersService } from './Services/users.service';
import { CreateGroupComponent } from './create-group/create-group.component';
import { MatSelectModule } from '@angular/material/select';
import { GroupChatDialogComponent } from './group-chat-dialog/group-chat-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlingInterceptor } from './error-handling.interceptor';
import { ErrorComponent } from './error/error.component';
import { NotificationComponent } from './notification/notification.component';
import { ConfirmDialogueComponent } from './confirm-dialogue/confirm-dialogue.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignUpComponent,
    FriendsComponent,
    OnlineUsersComponent,
    HomeComponent,
    ChatDialogComponent,
    CreateGroupComponent,
    GroupChatDialogComponent,
    ErrorComponent,
    NotificationComponent,
    ConfirmDialogueComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
    MatToolbarModule,
    MatPaginatorModule,
    DragDropModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    ConfirmDialogModule,
    ToastModule,
    MatSnackBarModule,
    SocketIoModule.forRoot({ url: 'http://localhost:3050' }),
  ],
  providers: [
  
    // MessageService,
    
    // SocketService,
    {provide:LocationStrategy,useClass:HashLocationStrategy},
    
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  // entryComponents:[ErrorComponent]
})
export class AppModule {}
