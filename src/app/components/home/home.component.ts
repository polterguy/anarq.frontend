/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

/*
 * Custom imports for component.
 */
import { CaseSlim } from 'src/app/models/case-slim';
import { PublicService } from 'src/app/services/http/public.service';
import { RegionsModel } from 'src/app/models/regions-model';
import { MessageService, Messages } from 'src/app/services/message.service';
import { BaseComponent } from 'src/app/helpers/base.components';

/**
 * This is the component for the main home page, or the
 * landing page at the root URL for the app.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent {

  /*
   * List of cases relevant to the user.
   */
  private cases: CaseSlim[] = [];

  /*
   * If true, user can fetch more cases relevant to his current option.
   */
  private more: boolean;

  /*
   * Wrapper for all regions relevant to the user.
   */
  private regions: RegionsModel = null;

  /**
   * Constructor for component.
   * 
   * @param httpService Service to retrieve data from server.
   * @param messageService Message publishing/subscription bus service.
   * @param snackBar Snack bar required by base class to show errors.
   */
  constructor(
    protected httpService: PublicService,
    protected messageService: MessageService,
    protected snackBar: MatSnackBar)
  {
    super(httpService, messageService, snackBar);
  }

  /**
   * Returns next "batch" of cases relevant to the client.
   */
  public getMore() {

    // Retrieving username first.
    const username = this.messageService.getValue(Messages.APP_GET_USERNAME);

    // Getting next batch of cases.
    this.httpService.getOpenCases(this.cases.length, null, username).subscribe(res => {
      this.more = res && res.length === 25;
      this.cases = this.cases.concat(res);
    }, err => this.handleError);
  }

  /**
   * @inheritDoc
   */
  protected initSubscriptions() {

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

  /**
   * @inheritDoc
   * 
   * Implementation simply returns all open cases, which depends upon whether
   * or not the user is logged in or not.
   */
  protected init() {
    this.getOpenCases();
  }

  /*
   * Returns all open cases relevant to client, which depends upon whether or
   * not the client is logged in or not.
   * 
   * If the client is logged in, he will only see open cases in regions relevant
   * to him or her. If client is not logged in, all cases will be returned, and no
   * filter applied.
   */
  private getOpenCases() {

    // Retrieving username first.
    const username = this.messageService.getValue(Messages.APP_GET_USERNAME);

    // Getting open cases relevant to user, or all cases if no username was given.
    this.httpService.getOpenCases(null, null, username).subscribe(res => {
      this.cases = res;
      this.more = res !== null && res.length === 25;
    }, err => this.handleError);

    /*
     * Checking if user is logged in, and if so, we retrieve
     * all regions for currently logged in user.
     */
    if (username !== null) {
      this.httpService.getMyRegions().subscribe(res => {
        this.regions = res;
      }, err => this.handleError);
    }
  }
}
