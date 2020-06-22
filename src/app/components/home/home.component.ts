/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

/*
 * Custom imports for component.
 */
import { CaseSlim } from 'src/app/models/case-slim';
import { BaseComponent } from 'src/app/helpers/base.component';
import { StatisticsModel } from 'src/app/models/statistics-model';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * This is the component for the main home page, or the
 * landing page at the root URL for the app.
 */
@Component({
  templateUrl: './home.component.html',
  selector: 'app-home',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent {

  public cases: CaseSlim[] = [];
  public regions: string[] = [];
  public statistics: StatisticsModel = null;
  public sorting: string;
  public offset = 0

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param router Router to navigate to specific cases, etc.
   * @param activatedRoute Necessary to parse query parameters.
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
   * Implementation simply returns all open cases, which depends upon whether
   * or not the user is logged in or not.
   */
  protected init() {

    // Figuring out offset to use.
    this.activatedRoute.queryParams.subscribe(res => {
      if (res && res.offset) {
        this.offset = res.offset;
      }
      this.getCases();
    });

    this.getRegions();
    this.service.getStatistics().subscribe(res => {
      this.statistics = res;
    });

    /*
     * Removing first case property, to avoid it showing up on every
     * single case user views.
     */
    localStorage.removeItem('first_case');
  }

  /**
   * @inheritDoc
   * 
   * The only messages we are interested in, is when user logs in and out,
   * since that changes the cases he sees.
   */
  protected initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messages.getMessage().subscribe(msg => {

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
          this.cases = [];
          this.regions = [];
          this.getCases();
          break;

        case Messages.APP_LOGGED_IN:
          this.cases = [];
          this.getCases();
          this.getRegions();
          break;
      }
    });
  }

  /**
   * Sorting was changed, hence we need to retrieve cases again from backend.
   */
  public sortingChanged() {
    this.cases = [];
    localStorage.setItem('home_sorting', this.sorting);
    this.getCases();
  }

  /**
   * Returns all open cases relevant to client, which depends upon whether or
   * not the client is logged in or not.
   * 
   * If the client is logged in, he will only see open cases in regions relevant
   * to him or her. If client is not logged in, all cases will be returned, and no
   * filter applied.
   */
  public getCases() {

    // Retrieving username first.
    const username = this.messages.getValue(Messages.APP_GET_USERNAME);

    // Figuring out how to sort items.
    let localStorageSorting = localStorage.getItem('home_sorting');
    if (!this.userIsLoggedIn() &&
      (localStorageSorting === 'my-cases' || localStorageSorting === 'my-votes-cases')) {
        localStorageSorting = 'popular';
    }
    this.sorting = localStorageSorting || 'popular';

    // Getting open cases relevant to user, or all cases if no username was given.
    this.service.getOpenCases(this.offset, null, username, this.sorting).subscribe(res => {
      this.cases = res || [];
    }, error => this.handleError(error));
  }

  /**
   * Retrieves all relevant regions for currently authenticated user from server.
   */
  public getRegions() {

    // Retrieving username first.
    const username = this.messages.getValue(Messages.APP_GET_USERNAME);

    /*
     * Checking if user is logged in, and if so, we retrieve
     * all regions for currently logged in user.
     */
    if (username !== null) {

      // User is authenticated, retrieving user's regions.
      this.service.getMyRegions().subscribe(res => {
        if (res && res.regions && res.regions.length > 0) {
          this.regions = res.regions;
        } else {
          setTimeout(() => this.router.navigate(['/setup-regions']), 2000);
          this.snack.open(
            this.translate('YouNeedToSetupRegions'),
            'ok', {
              duration: 2000,
            });
        }
      }, error => this.handleError(error));
    }
  }

  /**
   * Returns true if user is logged in.
   */
  public userIsLoggedIn() {
    return this.messages.getValue(Messages.APP_GET_USERNAME) !== null;
  }
}
