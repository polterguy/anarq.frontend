/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseSlim } from 'src/app/models/case-slim';
import { BaseComponent } from 'src/app/helpers/base.components';
import { MessageService, Messages } from 'src/app/services/message.service';
import { PublicService } from 'src/app/services/http/public.service';

/**
 * Component for viewing cases within a single region in the system.
 * Also allows you to create cases within the specified region, which
 * is found by parsing parameters passed into the component.
 */
@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent extends BaseComponent {

  public cases: CaseSlim[] = [];
  private more: boolean;
  public region: string = null;
  public canCreateCase = false;

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
    protected snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router)
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
    this.route.params.subscribe(pars => {
      this.region = pars.region;
      this.getNextBatch();
    });
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
          this.getNextBatch();
          break;

        case Messages.APP_LOGGED_IN:
          this.cases = [];
          this.getNextBatch();
          break;
      }
    });
  }

  /**
   * Returns next "batch" of cases relevant to the client.
   */
  public getNextBatch() {

    // Retrieving username, if any for currently authenticated client.
    const username = this.messages.getValue(Messages.APP_GET_USERNAME);

    // Retrieving next batch of open cases within region.
    this.service.getOpenCases(this.cases.length, this.region, username).subscribe(res => {
      this.more = res && res.length === 25;
      if (res) {
        this.cases = this.cases.concat(res);
      }
    });
  }

  /**
   * Capitalizes region's name, making sure it starts with a CAPS character.
   * 
   * @param region Region name
   */
  capitalize(region: string) {
    return region.charAt(0).toUpperCase() + region.slice(1);
  }

  /**
   * Returns a string representation of open cases,
   * counting positive versus negative votes for the case.
   * 
   * @param item Case item
   */
  getCount(item: CaseSlim) {
    return item.positive + '/' + (item.votes - item.positive);
  }

  /**
   * Asks a question within the current region.
   */
  askQuestion() {
    this.router.navigate(['/ask/' + this.region]);
  }
}
