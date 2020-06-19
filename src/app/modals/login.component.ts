/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSnackBar
} from '@angular/material';
import { BaseComponent } from '../helpers/base.component';
import { PublicService } from '../services/http/public.service';

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

  private username: string;
  private password: string;
  private email: string;
  private forgotPasswordClicked = false;

  /*
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private service: PublicService) { }

  /**
   * Logs user in by authenticating him or her towards the backend.
   */
  private login() {
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

  /**
   * Invoked when user cancels edit/create operation.
   */
  private cancel() {
    this.dialogRef.close();
  }

  /**
   * Translates a key, and returns its translated value
   * acccording to user's preferred language.
   * 
   * @param key Key to lookup
   */
  private translate(key: string) {
    return BaseComponent.translate(key);
  }

  /**
   * Invoked when user clicks the forgot password button.
   */
  private forgotPassword() {
    this.forgotPasswordClicked = true;
  }

  /**
   * Sends a reset password link to email address.
   */
  private sendResetLink() {
    this.service.sendPasswordResetLink(this.email).subscribe(res => {
      this.snackBar.open(
        this.translate('ResetPasswordLinkSent'),
        'ok', {
          duration: 5000,
        });
        this.dialogRef.close();
    }, error => console.log(error));
  }
}
