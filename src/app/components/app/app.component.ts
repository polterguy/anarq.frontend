/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

// Angular imports.
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services your app depends upon.
import { LoaderService } from '../../services/loader.service';
import { PublicService } from '../../services/http/public.service';
import { MessageService, Messages } from '../../services/message.service'

// Custom components needed in this component.
import { LoginComponent } from '../../modals/login.component';
import { LanguageModel } from 'src/app/models/language-model';
import { BaseComponent } from 'src/app/helpers/base.components';

/*
 * This is your app's main "wire frame" component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {

  // Databound towards your side navigation. If true, it implies the navbar menu is expanded.
  private sidenavOpened = false;
  private language: string = 'no';

  /*
   * Smaller optimisation to make it easier to check which roles currently logged in
   * user belongs to. Notice, this is needed to figure out which navbar items we want
   * to show, and which we want to hide.
   */
  private token: any = null;
  private isLoggedIn = false;
  private showRegisterLink = true;
  private languages: LanguageModel[] = [];
  private showPage = false;

  /**
   * 
   * @param loaderService Service used to show/hide Ajax spinner during invocations towards the server.
   * @param service @inheritDoc
   * @param messages @inheritDoc
   * @param snack @inheritDoc
   * @param jwtHelper JWT helper service, to decode and parse JWT tokens.
   * @param dialog Material dialog helper, used to display login window.
   */
  constructor(
    public loaderService: LoaderService,
    protected service: PublicService,
    protected messages: MessageService,
    protected snack: MatSnackBar,
    private jwtHelper: JwtHelperService,
    private dialog: MatDialog)
  {
    super(service, messages, snack);
  }

  /**
   * @inheritDoc
   * 
   * Implementation simply returns all open cases, which depends upon whether
   * or not the user is logged in or not.
   */
  protected init() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      if (this.jwtHelper.isTokenExpired()) {
        localStorage.removeItem('jwt_token');
      } else {
        this.token = this.jwtHelper.decodeToken(token);
        this.isLoggedIn = true;
        this.tryRefreshTicket();
      }
    }

    // Retrieving supported languages.
    this.service.getLanguages().subscribe(res => {
      this.languages = res;

      // Checking if we have stored a current language selection for user.
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) {
        this.language = storedLanguage;
      } else {
        localStorage.setItem('language', this.language);
      }

      // Retrieving translations for currently selected language.
      this.service.getTranslations(this.language).subscribe(res => {
        BaseComponent.translations = res || [];
        this.showPage = true;
      }, error => this.handleError(error));

    }, error => this.handleError(error));
  }

  /**
   * @inheritDoc
   * 
   * Initializing subscriptions for component, and returns
   * subscription to caller.
   */
  protected initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messages.getMessage().subscribe(msg => {

      switch (msg.name) {

        /*
         * Sent when user is logging in.
         *
         * Notice, normally this message would only be raised from within
         * this component, but to make things extendible, we still use messaging
         * to accomplish this.
         */
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
          this.isLoggedIn = true;
          this.messages.sendMessage({
            name: Messages.APP_LOGGED_IN,
            content: this.token,
          });
          break;

        /*
         * Published when user is logging out for some reasons.
         *
         * Notice, normally this message would only be raised from within
         * this component, but to make things extendible, we still use messaging
         * to accomplish this.
         */
        case Messages.APP_LOGOUT:
          localStorage.removeItem('jwt_token');
          this.token = null;
          this.isLoggedIn = false;
          this.messages.sendMessage({
            name: Messages.APP_LOGGED_OUT
          });
          break;

        /*
         * Published when JWT token has been refreshed for some reasons.
         *
         * Notice, normally this message would only be raised from within
         * this component, but to make things extendible, we still use messaging
         * to accomplish this.
         */
        case Messages.APP_TOKEN_REFRESHED:
          console.log('JWT token was refreshed');
          break;

        /*
         * Published when some other component needs the JWT token for some reasons.
         *
         * Will return the JWT token in 'decoded' format.
         */
        case Messages.APP_GET_JWT_TOKEN:
          msg.content = this.token;
          break;

        /*
         * Published when some other component needs the username of the
         * currently authenticated user for some reasons.
         */
        case Messages.APP_GET_USERNAME:
          msg.content = this.token?.unique_name ?? null;
          break;

        case Messages.APP_SHOW_LOGIN_REGISTER:
          this.showRegisterLink = true;
          break
  
        case Messages.APP_HIDE_LOGIN_REGISTER:
          this.showRegisterLink = false;
          break

      }
    });
  }

  /**
   * Determines if menu button should be shown, which
   * is only true if the user belongs to a role that have
   * access to one or more of the menu items in the menu.
   */
  public shouldDisplayMenuButton() {
    return this.token?.role?.split(',').filter((x: any) => {
      return x === 'admin' || x === 'moderator' || x === 'root';
    })?.length > 0 || false;
  }

  /**
   * Logs the user out, and removes the JWT token from local storage.
   */
  public logout() {
    this.messages.sendMessage({
      name: Messages.APP_LOGOUT,
    });
  }

  /**
   * Tries to login the user, by showing a modal dialog, allowing him
   * or her to type in their username/password combination.
   */
  public tryLogin() {

    // Creating our modal dialog, passing in the cloned entity, and "isEdit" as true.
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(res => {

      // Checking of 'OK' was clicked.
      if (res !== null && res !== undefined && res.ticket) {

        /*
         * We have a valid JWT ticket, now making sure all components
         * interested in knowing gets to know, and allowing component
         * responsible for storing JWT token correctly handle it as is.
         */
        this.messages.sendMessage({
          name: Messages.APP_LOGIN,
          content: res.ticket
        });
      }
    });
  }

  /**
   * Returns the username of the currently authenticated user, or
   * null if client is not authenticated.
   */
  public getUsername() {
    return this.token?.unique_name || null;
  }

  /**
   * Refreshes the JWT token by invoking the HTTP service's endpoint
   * for refreshing the JWT token.
   */
  tryRefreshTicket() {

    // Verifying user hasn't logged out since timer was created.
    if (this.isLoggedIn) {

      // Invokes refresh backend method.
      this.service.refreshTicket().subscribe(res => {

        // Success, updating JWT token, and invoking "self" 5 minutes from now.
        localStorage.setItem('jwt_token', res.ticket);
        this.token = this.jwtHelper.decodeToken(res.ticket);
        this.messages.sendMessage({
          name: Messages.APP_TOKEN_REFRESHED,
          content: this.token,
        });
        setTimeout(() => this.tryRefreshTicket(), 300000);

      }, error => this.handleError(error));
    }
  }

  /**
   * Opens up the side navigation menu.
   */
  public openSideNavigation() {
    this.sidenavOpened = true;
  }

  /**
   * Closes the side navigation menu.
   */
  public closeNavigator() {
    this.sidenavOpened = false;
  }

  /**
   * Checks to see if the currently authenticated user, if any,
   * belongs to one or more of the roles given as an argument.
   * Notice, if list is empty or null, method will always return true.
   * 
   * @param roles Roles to check if user belongs to.
   */
  public inRole(roles: string[]) {
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

  /**
   * Invoked when language is selected.
   */
  private languageSelected() {
    this.service.getTranslations(this.language).subscribe(res => {
      BaseComponent.translations = res || [];
      localStorage.setItem('language', this.language);
    }, error => this.handleError(error));
  }
}
