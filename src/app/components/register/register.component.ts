/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/*
 * Custom imports for component.
 */
import { BaseComponent } from 'src/app/helpers/base.component';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * Component for allowing users to register at the site.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent {

  // Form controls, necessary to validate values during writing.
  private username: FormControl;
  private email: FormControl;
  private name: FormControl;
  private phone: FormControl;
  private password: FormControl;
  private passwordRepeat: FormControl;
  private stepNo = 1;
  private stepTotal = 5;

  // If true, password is readable, and not hidden in input.
  private passwordReadable = false;
  private passwordRepeatReadable = false;

  // If true, we show additional information about the field.
  private showNameInfo = false;
  private showPhoneInfo = false;

  // Progress of registration.
  private progress = 0;

  // Whether or not user agrees to the terms and conditions of the site.
  private agree = false;

  // If true, user has successfully registered, and we show information about verifying his or her email.
  private done = false;

  // Validation of fields.
  private usernameGood?: boolean = null;
  private emailGood?: boolean = null;
  private nameGood?: boolean = null;
  private phoneGood?: boolean = null;
  private passwordGood?: boolean = null;
  private passwordRepeatGood?: boolean = null;

  // Number of milliseconds after a keystroke before validating value of control.
  private debounce = 800;

  // Captcha response.
  private captchaResponse: string = null;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param router Router to allow us to redirect user to router links.
   */
  constructor(
    protected service: PublicService,
    protected messages: MessageService,
    protected snack: MatSnackBar,
    private router: Router)
  {
    super(service, messages, snack);
  }

  /**
   * @inheritDoc
   * 
   * We simply check if user is registered at site from before, or
   * more specifically if he is logged in, and if so, we tell him so,
   * and redirects him to main landing page of site after some 2 seconds.
   * 
   * In addition, we initialize all the FormControls for each input field.
   */
  protected init() {

    // Hiding register link.
    setTimeout(() => {
      this.messages.sendMessage({
        name: Messages.APP_HIDE_LOGIN_REGISTER,
      });
    }, 1);

    // Checking if user is already logged in, at which point we prohibit him from registering again.
    if (this.messages.getValue(Messages.APP_GET_USERNAME)) {
      this.snack.open(
        this.translate('YouAreAlreadyRegistered'),
        'ok');
      setTimeout(() => this.router.navigate(['/']), 1000);
    }

    /*
     * Initializing FormControl instances.
     *
     * Notice, since we want to validate data as the user is
     * typing in characters, we use debouncing until value has
     * not changed for some specific amount of time, at which point
     * we try to validate the data.
     */

    // Email control.
    this.email = new FormControl('');
    this.email.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.email.value.includes('@') && this.email.value.includes('.')) {
          this.service.emailAvailable(this.email.value).subscribe(res => {
            if (res.result === 'SUCCESS') {
              this.progress = 20;
              this.stepNo = 2;
              this.emailGood = true;
            } else {
              this.progress = 0;
              this.stepNo = 1;
              this.snack.open(
                res.extra,
                'ok', {
                  duration: 5000,
                });
              this.emailGood = false;
            }
          }, error => this.handleError(error));
        } else {
          this.stepNo = 1;
          this.progress = 0;
          this.emailGood = false;
        }
      });

    // Username control.
    this.username = new FormControl('');
    this.username.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.username.value.length >= 4 && !this.username.value.includes('@')) {
          this.service.usernameAvailable(this.username.value).subscribe(res => {
            if (res.result === 'SUCCESS') {
              this.progress = 40;
              this.stepNo = 3;
              this.usernameGood = true;
            } else {
              this.progress = 20;
              this.stepNo = 2;
              this.snack.open(
                this.translate('UsernameAlreadyRegistered', [this.username.value]),
                'ok', {
                  duration: 3000,
                });
              this.usernameGood = null;
            }
          }, error => {
            this.stepNo = 2;
            this.progress = 20;
            this.usernameGood = false;
            this.handleError(error);
          });
        } else {
          this.stepNo = 2;
          this.progress = 20;
          this.usernameGood = false;
        }
      });

    // Full name control.
    this.name = new FormControl('');
    this.name.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (this.name.value.length > 5 &&
          this.name.value.includes(' ') &&
          this.name.value.toLowerCase() !== this.name.value) {
          this.progress = 60;
          this.stepNo = 4;
          this.nameGood = true;
        } else {
          this.stepNo = 3;
          this.progress = 40;
          this.nameGood = false;
        }
      });

    // Phone control
    this.phone = new FormControl('');
    this.phone.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        const regex = /^[0-9]{8}$/
        if (regex.test(this.phone.value)) {
          this.service.phoneAvailable(this.phone.value).subscribe(res => {
            if (res.result === 'SUCCESS') {
              this.progress = 80;
              this.stepNo = 5;
              this.phoneGood = true;
            } else {
              this.progress = 60;
              this.stepNo = 4;
              this.snack.open(
                res.extra,
                'ok', {
                  duration: 10000,
                });
              this.phoneGood = false;
            }
          }, error => this.handleError(error));
        } else {
          this.stepNo = 4;
          this.progress = 60;
          this.phoneGood = false;
        }
      });

    // Password control.
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
            this.stepNo = 5;
          } else {
            this.passwordRepeatGood = true;
          }
        }
      });

    // Password repeat control.
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

  /**
   * @inheritDoc
   * 
   * We're only interested in handling when the user is logging in, since
   * that prohibits him from registering again, and we redirect him to the
   * main landing page of the site if he does.
   */
  protected initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messages.getMessage().subscribe(msg => {

      switch (msg.name) {

        /*
         * The only message we're really interested in, is when user is logging in,
         * at which point we tell him he is already registered, and redirects him
         * to main landing page of site.
         */
        case Messages.APP_LOGGED_IN:
          this.snack.open(
            this.translate('YouCanOnlyRegisterOnce'),
            'ok', {
              duration: 2000,
            });
          setTimeout(() => this.router.navigate(['/']), 1000);
          break;
      }
    });
  }

  /**
   * Toggles whether or not password should be shown in plain text or not.
   */
  private togglePasswordReadability() {
    this.passwordReadable = !this.passwordReadable;
    this.passwordRepeatReadable = !this.passwordRepeatReadable;
  }

  /**
   * Shows information about why we need the full legal name for users.
   */
  private showNameInformation() {
    this.showNameInfo = !this.showNameInfo;
  }

  /**
   * Shows information about why we need the phone number for users.
   */
  private showPhoneInformation() {
    this.showPhoneInfo = !this.showPhoneInfo;
  }

  /**
   * Invoked when user has been determined to be a human being.
   * 
   * @param data Data from reCAPTCHA
   */
  private captchaResolved(data) {
    this.captchaResponse = data;
  }

  /**
   * Invoked when user clicks the submit button.
   * 
   * @param token reCAPTCHA token, for verifyin user is a human being
   */
  private register() {

    // Invokes HTTP service layer to register the user at the site.
    this.service.register({
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      full_name: this.name.value,
      phone: this.phone.value,
      captcha: this.captchaResponse,
      language: localStorage.getItem('language'),
    }).subscribe(res => {
      if (res.result === 'SUCCESS') {

        /*
         * Success, showing general information to user, asking him to check his email inbox,
         * to verify his email address.
         */
        this.snack.open(
          this.translate('PleaseCheckEmailInbox'),
          'ok', {
            duration: 3000,
          });
        this.done = true
        setTimeout(
          () => this.router.navigate(['/']),
          5000);
      } else {
        this.snack.open(
          res.extra,
          'ok', {
            duration: 5000,
          });
      }
    }, error => this.handleError(error));
  }
}
