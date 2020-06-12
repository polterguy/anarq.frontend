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
  private name: FormControl;
  private phone: FormControl;
  private password: FormControl;
  private passwordRepeat: FormControl;
  private passwordReadable = false;
  private passwordRepeatReadable = false;
  private progress = 0;

  // Validation of fields.
  private usernameGood?: boolean = null;
  private emailGood?: boolean = null;
  private nameGood?: boolean = null;
  private phoneGood?: boolean = null;
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

    this.email = new FormControl('');
    this.email.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.email.value.includes('@')) {
          this.service.emailAvailable(this.email.value).subscribe(res => {
            if (res.result === 'SUCCESS') {
              this.progress = 20;
              this.emailGood = true;
            } else {
              this.progress = 0;
              this.snackBar.open(
                'Email \'' + this.email.value + '\' is already registered, or not a valid email address', 
                'ok', {
                  duration: 5000,
                });
              this.emailGood = null;
            }
          });
        } else {
          this.progress = 0;
          this.emailGood = false;
        }
      });

    this.username = new FormControl('');
    this.username.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.username.value.length >= 4 && !this.username.value.includes('@')) {
          this.service.usernameAvailable(this.username.value).subscribe(res => {
            if (res.result === 'SUCCESS') {
              this.progress = 40;
              this.usernameGood = true;
            } else {
              this.progress = 20;
              this.snackBar.open(
                'Username \'' + this.username.value + '\' is already registered', 
                'ok', {
                  duration: 3000,
                });
              this.usernameGood = null;
            }
          });
        } else {
          this.progress = 20;
          this.usernameGood = false;
        }
      });

    this.name = new FormControl('');
    this.name.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.name.value.length > 5 && this.name.value.includes(' ')) {
          this.progress = 60;
          this.nameGood = true;
        } else {
          this.progress = 40;
          this.nameGood = false;
        }
      });

    this.phone = new FormControl('');
    this.phone.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.phone.value.length >= 8) {
          this.progress = 80;
          this.phoneGood = true;
        } else {
          this.progress = 60;
          this.phoneGood = false;
        }
      });

    this.password = new FormControl('');
    this.password.valueChanges
      .pipe(debounceTime(this.debounce / 10), distinctUntilChanged())
      .subscribe(query => {
        if (this.password.value.length >= 10) {
          this.passwordGood = true;
        } else {
          this.passwordGood = false;
        }
        if (this.passwordRepeat.value.length > 0) {
          if (this.password.value !== this.passwordRepeat.value) {
            this.passwordRepeatGood = false;
            this.progress = 80;
          } else {
            this.passwordRepeatGood = true;
          }
        }
      });

    this.passwordRepeat = new FormControl('');
    this.passwordRepeat.valueChanges
      .pipe(debounceTime(this.debounce / 10), distinctUntilChanged())
      .subscribe(query => {
        if (this.password.value === this.passwordRepeat.value) {
          this.progress = 100;
          this.passwordRepeatGood = true;
        } else {
          this.progress = 80;
          this.passwordRepeatGood = false;
        }
      });
  }

  getProgress() {
    return this.progress;
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

  makePasswordReadable() {
    this.passwordReadable = !this.passwordReadable;
    this.passwordRepeatReadable = !this.passwordRepeatReadable;
  }

  showNameInformation() {
    this.snackBar.open(
      'In order to legally ensure you are an existing person, we need your full legal name, exactly as it can be found in the yellow pages.',
      'ok', {
        duration: 10000,
      });
  }

  showPhoneInformation() {
    this.snackBar.open(
      'In order to legally ensure you are an existing person, we need your cell phone number, exactly as it can be found in the yellow pages.',
      'ok', {
        duration: 10000,
      });
  }

  register() {
    this.service.register({
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      full_name: this.name.value,
      phone: this.phone.value,
    }).subscribe(res => {
      if (res.result === 'SUCCESS') {
        this.snackBar.open(
          'Please check your email inbox',
          'ok', {
            duration: 3000,
          });
      }
    }, err => {
      this.snackBar.open(
        err.error.message, 
        'ok', {
          duration: 5000,
        });
    });
  }
}
