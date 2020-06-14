/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

/*
 * Custom imports for component.
 */
import { CaseSlim } from 'src/app/models/case-slim';
import { PublicService } from 'src/app/services/http/public.service';
import { RegionsModel } from 'src/app/models/regions-model';
import { MessageService, Messages } from 'src/app/services/message.service';

/*
 * This is the component for the main home page, or the
 * landing page at the root URL for the app.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  /*
   * List of cases relevant to the user.
   */
  public cases: CaseSlim[] = [];

  /*
   * If true, user can fetch more cases relevant to his current option.
   */
  private more: boolean;

  /*
   * Wrapper for all regions relevant to the user.
   */
  public regions: RegionsModel = null;

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
    private messageService: MessageService,
    private snackBar: MatSnackBar) { }

  /*
   * OnInit implementation for component.
   */
  ngOnInit() {
    this.getOpenCases();

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

        /*
         * Cases are dependent upon whether or not a user is logged in or not.
         * If the client is logged in, he will only see relevant cases, for his
         * regions, that he have still not voted for.
         * 
         * If client is not logged in, he will see all cases, but not be able
         * to vote for any of them.
         * Hence, we need to handle these two messages, and once raised, fetch
         * all cases again.
         */
        case Messages.APP_LOGGED_OUT:
          this.getOpenCases();
          break;

        case Messages.APP_LOGGED_IN:
          this.getOpenCases();
          break;
      }
    });
  }

  getOpenCases() {

    // Retrieving username first.
    const username = this.messageService.getValue(Messages.APP_GET_USERNAME);

    // Getting open cases relevant to user, or all cases if no username was given.
    this.httpService.getOpenCases(null, null, username).subscribe(res => {
      this.cases = res;
      this.more = res !== null && res.length === 25;
    }, err => {
      this.snackBar.open(
        err.errror.message,
        'ok', {
          duration: 5000
        });
    });

    /*
     * Checking if user is logged in, and if so, we retrieve
     * all regions for currently logged in user.
     */
    if (username !== null) {
      this.httpService.getMyRegions().subscribe(res => {
        this.regions = res;
      }, err => {

        // Oops ...!!
        console.error(err);
        this.snackBar.open(
          err.errror.message,
          'ok', {
            duration: 5000
          });
      });
    }
  }

  getMore() {

    // Retrieving username first.
    const username = this.messageService.getValue(Messages.APP_GET_USERNAME);

    // Getting next batch of cases.
    this.httpService.getOpenCases(this.cases.length, null, username).subscribe(res => {
      this.more = res && res.length === 25;
      this.cases = this.cases.concat(res);
    }, err => {

      // Oops ...!!
      console.error(err);
      this.snackBar.open(
        err.errror.message,
        'ok', {
          duration: 5000
        });
    });
  }

  getCount(item: CaseSlim) {
    return item.positive + '/' + (item.votes - item.positive);
  }

  hasNoCases() {
    return !this.cases || this.cases.length === 0;
  }
}
