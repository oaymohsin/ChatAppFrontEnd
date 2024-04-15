import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialogue',
  templateUrl: './confirm-dialogue.component.html',
  styleUrls: ['./confirm-dialogue.component.css'],
})
export class ConfirmDialogueComponent {
  confirmdata: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef:MatDialogRef<ConfirmDialogueComponent>
  
  )
  
  {
    this.confirmdata = data;
    console.log(data);
  }

  confirmButton(data:any){
    this.dialogRef.close(data)
  }
}
