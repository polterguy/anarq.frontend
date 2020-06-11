/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/http/public.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private username: FormControl;
  private email: FormControl;
  private password: FormControl;
  private passwordRepeat: FormControl;

  // Validation of fields.
  private usernameGood?: boolean = null;
  private emailGood?: boolean = null;
  private passwordGood?: boolean = null;
  private passwordRepeatGood?: boolean = null;

  // Number of milliseconds after a keystroke before filtering should be re-applied.
  private debounce = 800;
  
  constructor(
    private service: PublicService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.snackBar.open(
        'You are already registered at this site',
        'ok');
    }

    this.username = new FormControl('');
    this.username.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.username.value.length >= 4 && !this.username.value.includes('@')) {
          this.service.usernameAvailable(this.username.value).subscribe(res => {
            if (res.result === 'SUCCESS') {
              this.usernameGood = true;
            } else {
              this.usernameGood = false;
            }
          });
        } else {
          this.usernameGood = false;
        }
      });

    this.email = new FormControl('');
    this.email.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.email.value.includes('@')) {
          this.service.emailAvailable(this.email.value).subscribe(res => {
            if (res.result === 'SUCCESS') {
              this.emailGood = true;
            } else {
              this.emailGood = false;
            }
          });
        } else {
          this.emailGood = false;
        }
      });

    this.password = new FormControl('');
    this.password.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.password.value.length >= 10) {
          this.passwordGood = true;
        } else {
          this.passwordGood = false;
        }
      });

    this.passwordRepeat = new FormControl('');
    this.passwordRepeat.valueChanges
      .pipe(debounceTime(this.debounce / 10), distinctUntilChanged())
      .subscribe(query => {
        if (this.password.value === this.passwordRepeat.value) {
          this.passwordRepeatGood = true;
        } else {
          this.passwordRepeatGood = false;
        }
      });
    }

  isLoggedIn() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return false;
    }
    if (this.jwtHelper.isTokenExpired(token)) {
      return false;
    }
    return true;
  }

  register() {
    this.service.register({
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
    }).subscribe(res => {
      if (res.status === 'SUCCESS') {
        this.snackBar.open(
          'Please check your email',
          'ok', {
            duration: 3000,
          });
      }
    });
  }
}
