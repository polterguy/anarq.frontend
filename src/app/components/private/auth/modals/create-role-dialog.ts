/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { UsersService } from 'src/app/services/http/users.service';

export interface DialogData {
  name: string;
}

@Component({
  templateUrl: 'create-role-dialog.html',
})
export class CreateRoleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private authService: UsersService) { }

  ok() {
    this.authService.createRole(this.data.name).subscribe(res => {
      this.dialogRef.close(this.data);
    }, error => {
      this.snackBar.open(error.error.message, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    });
  }
  
  cancel() {
    this.dialogRef.close();
  }
}
