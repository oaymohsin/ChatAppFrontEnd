import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';
// import { SuccessComponent } from './success/success.component';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    return next.handle(req).pipe(


      // tap((event:any) => {
      //   if (event?.body) {
      //     const response = event.body;
      //     this.dialog.open(ErrorComponent, { data: { message: response.message } });

      //     // Close the success dialog after 3000 milliseconds (3 seconds)
      //     setTimeout(() => {
      //       this.dialog.closeAll();
      //     }, 700);
      //   }
      // }),

      
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
