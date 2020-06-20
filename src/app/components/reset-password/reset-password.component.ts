/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

/*
 * Custom imports for component.
 */
import { BaseComponent } from 'src/app/helpers/base.component';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * This is the component for setting up user's regions.
 * This is in general terms only allowed initially, as the
 * user confirm his email, during the registration process.
 */
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseComponent {

  private username: string;
  private hash: string;
  private password: string;
  private passwordRepeat: string;
  private passwordReadable = false;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param router Necessary to redirect user after having setup his regions.
   * @param activatedRoute Necessary to parse hash value from password link.
   */
  constructor(
    protected service: PublicService,
    protected messages: MessageService,
    protected snack: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute)
  {
    super(service, messages, snack);
  }

  /**
   * @inheritDoc
   * 
   * We really don't need to do much here,
   * except parse the hash and username of the request.
   */
  protected init() {
    this.activatedRoute.params.subscribe(pars => {
      this.username = pars.username;
      this.hash = pars.hash;
    });
  }

  /**
   * @inheritDoc
   * 
   * The only messages we are interested in, is when user logs in and out,
   * since that changes whether or not he is allowed to setup his regions or not.
   */
  protected initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messages.getMessage().subscribe(msg => {

      switch (msg.name) {

        /*
         * If user logs in, he (obviously) doesn't need the password reset
         * link, and we simply redirect him to home page.
         */
        case Messages.APP_LOGGED_IN:
          this.router.navigate(['/']);
          break;
      }
    });
  }

  /**
   * Toggles readability of password.
   */
  private togglePasswordReadability() {
    this.passwordReadable = !this.passwordReadable;
  }

  /**
   * Resets user's password, by invoking the backend, passsing in the hash,
   * username and new password.
   */
  private resetPassword() {

    // Verifying passwords are the same.
    if (this.password !== this.passwordRepeat) {
      this.snack.open(
        this.translate('PasswordDoNotMatch'),
        'ok', {
          duration: 5000,
        });
      return;
    }

    // Verifying password is long enough.
    if (this.password.length < 10) {
      this.snack.open(
        this.translate('PasswordIsNotLongEnough'),
        'ok', {
          duration: 5000,
        });
      return;
    }

    // Passwords are the same.
    this.service.resetPassword(this.username, this.password, this.hash).subscribe(res => {
      if (res.result === 'SUCCESS') {
        this.snack.open(
          this.translate('YourPasswordWasChanged'),
          'ok', {
            duration: 5000,
          });
        this.messages.sendMessage({
          name: Messages.APP_LOGIN,
          content: res.extra
        });
        localStorage.removeItem('canRequestNewPassword');
        this.router.navigate(['/']);
      } else {
        this.snack.open(
          this.translate(res.extra),
          'ok', {
            duration: 5000,
          });
      }
    }, error => this.handleError(error));
  }
}
