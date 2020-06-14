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

  private cases: CaseSlim[] = [];
  private more: boolean = false;
  private regions: string[] = [];

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   */
  constructor(
    protected service: PublicService,
    protected messages: MessageService,
    protected snack: MatSnackBar)
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
    this.getNextBatch();
    this.getRegions();
  }

  /**
   * @inheritDoc
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
          this.getNextBatch();
          break;

        case Messages.APP_LOGGED_IN:
          this.cases = [];
          this.getNextBatch();
          this.getRegions();
          break;
      }
    });
  }

  /**
   * Returns all open cases relevant to client, which depends upon whether or
   * not the client is logged in or not.
   * 
   * If the client is logged in, he will only see open cases in regions relevant
   * to him or her. If client is not logged in, all cases will be returned, and no
   * filter applied.
   */
  private getNextBatch() {

    // Retrieving username first.
    const username = this.messages.getValue(Messages.APP_GET_USERNAME);

    // Getting open cases relevant to user, or all cases if no username was given.
    this.service.getOpenCases(null, null, username).subscribe(res => {
      this.more = res !== null && res.length === 25;
      this.cases = res;
    }, err => this.handleError);
  }

  /**
   * Retrieves all relevant regions for currently authenticated user from server.
   */
  private getRegions() {

    // Retrieving username first.
    const username = this.messages.getValue(Messages.APP_GET_USERNAME);

    /*
     * Checking if user is logged in, and if so, we retrieve
     * all regions for currently logged in user.
     */
    if (username !== null) {

      // User is authenticated, retrieving user's regions.
      this.service.getMyRegions().subscribe(res => {
        this.regions = res.regions;
      }, err => this.handleError);
    }
  }

  /**
   * Capitalizes region's name, making sure it starts with a CAPS character.
   * 
   * @param region Region name
   */
  private capitalize(region: string) {
    return region.charAt(0).toUpperCase() + region.slice(1);
  }
}
