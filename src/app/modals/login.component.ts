/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { UsersService } from '../services/http/users.service';

/*
 * Input data to dialog.
 */
export interface DialogData {
  ticket?: string;
}

/*
 * Modal dialog for editing your existing Case_types entity types, and/or
 * creating new entity types.
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public username: string;
  public password: string;

  /*
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private service: UsersService) { }

  login() {
    this.service.authenticate(this.username, this.password).subscribe(res => {
      this.dialogRef.close({
        ticket: res.ticket,
      });
    }, error => {
      // Oops, error!
      this.snackBar.open(error.error.message, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    });
  }

  // Invoked when user cancels edit/create operation.
  cancel() {
    this.dialogRef.close();
  }
}
