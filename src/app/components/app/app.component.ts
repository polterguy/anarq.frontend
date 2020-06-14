/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

// Angular imports.
import { MatDialog } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, OnDestroy } from '@angular/core';

// Services your app depends upon.
import { LoaderService } from '../../services/loader.service';
import { MessageService, Messages } from '../../services/message.service'
import { PublicService } from '../../services/http/public.service';

// Custom components needed in this component.
import { Subscription } from 'rxjs';
import { LoginComponent } from '../../modals/login.component';

/*
 * This is your app's main "wire frame" component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // Databound towards login form parts of component.
  private username: string;
  private password: string;

  // Databound towards your side navigation. If true, it implies the navbar menu is expanded.
  private sidenavOpened = false;

  /*
   * Smaller optimisation to make it easier to check which roles currently logged in
   * user belongs to. Notice, this is needed to figure out which navbar items we want
   * to show, and which we want to hide.
   */
  private token: any = null;

  /*
   * Message service subscription, allowing us to communicate with other components
   * in a publish/subscribe manner.
   */
  private messageSubscription: Subscription;

  /*
   * Constructor, doing nothing except taking a bunch of services.
   */
  constructor(
    private httpService: PublicService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private dialog: MatDialog) { }

  /*
   * OnInit implementation for component.
   */
  ngOnInit() {

    // Initializing roles.
    const token = localStorage.getItem('jwt_token');
    if (token) {
      if (this.jwtHelper.isTokenExpired()) {
        localStorage.removeItem('jwt_token');
      } else {
        this.token = this.jwtHelper.decodeToken(token);
      }
    }

    // Initializing subscriptions.
    this.messageSubscription = this.initSubscriptions();
  }

  /*
   * OnDestroy implementation for component.
   */
  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  /*
   * Initializing subscriptions for component, and returns
   * subscription to caller.
   */
  private initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messageService.getMessage().subscribe(msg => {

      switch (msg.name) {

        // Sent when user is logging in.
        case Messages.APP_LOGIN:
          if (!msg.content) {
            throw 'No JWT token provided when trying to login';
          }
          localStorage.removeItem('jwt_token');
          this.token = null;
          if (this.jwtHelper.isTokenExpired(msg.content)) {
            throw 'Token is expired';
          }
          localStorage.setItem('jwt_token', msg.content);
          this.token = this.jwtHelper.decodeToken(msg.content);
          this.messageService.sendMessage({
            name: Messages.APP_LOGGED_IN,
            content: this.token,
          });
          break;

        // Sent when user is logging out for some reasons.
        case Messages.APP_LOGOUT:
          localStorage.removeItem('jwt_token');
          this.token = null;
          this.messageService.sendMessage({
            name: Messages.APP_LOGGED_OUT
          });
          break;

        // Sent when user is logging out for some reasons.
        case Messages.APP_TOKEN_REFRESHED:
          this.snackBar.open(
            'Your JWT token was refreshed',
            'ok', {
              duration: 2000,
            });
          break;

        // Sent when some component needs the JWT token for some reasons.
        case Messages.APP_GET_JWT_TOKEN:
          msg.content = this.token;
          break;

      }
    });
  }

  /*
   * Determines if menu button should be shown, which
   * is only tru if the user belongs to a role that have
   * access to one or more of the menu items in the menu.
   */
  shouldDisplayMenuButton() {
    return this.token?.roles?.filter(x => {
      return x === 'admin' || x === 'moderator' || x === 'root';
    })?.length > 0 || false;
  }

  /*
   * Returns true if user is logged in, with a valid token,
   * that's not expired.
   */
  isLoggedIn() {
    return this.token !== null;
  }

  /*
   * Logs the user out, and removes the token from local storage.
   */
  logout() {
    this.messageService.sendMessage({
      name: Messages.APP_LOGOUT,
    });
  }

  tryLogin() {

    // Creating our modal dialog, passing in the cloned entity, and "isEdit" as true.
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== null && res !== undefined && res.ticket) {
        this.messageService.sendMessage({
          name: Messages.APP_LOGIN,
          content: res.ticket
        });
      }
    });
  }

  getUsername() {
    return this.token?.unique_name || null;
  }

  // Invoked before JWT token expires. Tries to "refresh" the JWT token, by invoking backend method.
  tryRefreshTicket() {

    // Verifying user hasn't logged out since timer was created.
    if (this.isLoggedIn()) {

      // Invokes refresh backend method.
      this.httpService.refreshTicket().subscribe(res => {

        // Success, updating JWT token, and invoking "self" 5 minutes from now.
        localStorage.setItem('jwt_token', res.ticket);
        setTimeout(() => this.tryRefreshTicket(), 300000);

      }, error => {

        // Oops, some sort of error.
        console.error(error);
        this.snackBar.open(
          'You have been automatically logged out, due to failing to refresh your token. Server message: ' + error,
          'Close', {
            panelClass: ['error-snackbar'],
          });
      });
    }
  }

  // Invoked when side navigation menu should be showed.
  openSideNavigation() {
    this.sidenavOpened = true;
  }

  // Invoked when side navigation menu should be hidden.
  closeNavigator() {
    this.sidenavOpened = false;
  }

  // Returns true if user belongs to (at least) one of the specified role names.
  inRole(roles: string[]) {
    if (roles === null || roles === undefined || roles.length === 0) {
      return true;
    }
    for (const idx of roles) {
      if (this.token?.roles?.indexOf(idx) !== -1) {
        return true;
      }
    }
    return false;
  }
}
