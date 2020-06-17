/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

/*
 * Custom imports for component.
 */
import { CaseView } from 'src/app/models/case-view';
import { FirstCaseModel } from 'src/app/models/first-case';
import { BaseComponent } from 'src/app/helpers/base.components';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * This is the component for viewing a single case.
 */
@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent extends BaseComponent {

  private item: CaseView = null;
  private id: number;
  private isLoggedIn = false;
  private firstCase = false;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param route Necessary to figure out parameters, to retrieve which case user is viewing.
   */
  constructor(
    protected service: PublicService,
    protected messages: MessageService,
    protected snack: MatSnackBar,
    private route: ActivatedRoute)
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

    // Checking if user is logged in or not.
    this.isLoggedIn = this.messages.getValue(Messages.APP_GET_USERNAME);

    // Retrieving case data.
    this.getCaseData();

    // Checking if this is the first case user created.
    const json = localStorage.getItem('first_case');
    if (json) {
      const firstCase = <FirstCaseModel>JSON.parse(json);
      if (firstCase.first) {
        this.firstCase = true;
      }
    }
  }

  /**
   * @inheritDoc
   * 
   * The only messages we are interested in, is when user logs in and out,
   * since that might change the case data he sees, depending upon how the
   * user voted for the case.
   */
  protected initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messages.getMessage().subscribe(msg => {

      switch (msg.name) {

        /*
         * Notice, what data the user sees about the case, might depend upo
         * his authentication.
         */
        case Messages.APP_LOGGED_OUT:
          this.isLoggedIn = false;
          this.getCaseData();
          break;

        case Messages.APP_LOGGED_IN:
          this.isLoggedIn = true;
          this.getCaseData();
          break;
      }
    });
  }

  /**
   * Fetches case data from backend.
   */
  private getCaseData() {
    this.route.params.subscribe(pars => {
      this.id = +pars.id;
      this.service.getCase(pars.id).subscribe(res => {
        this.item = res;
      });
    });
  }

  /**
   * Returns the URL for the currently viewed page.
   * 
   * This is necessary to create our QR code in the HTML parts
   * of the component.
   */
  getCaseUrl() {
    return window.location.href;
  }

  /**
   * User votes yes for case.
   */
  yes() {
    this.service.vote(this.id, true).subscribe(res => {
      this.item.opinion = true;
      this.snack.open(
        'A cryptographically signed email receipt of your vote was sent to your registered email address. Please keep this email safe somewhere in case of auditing of the system.',
        'ok', {
          duration: 10000,
        });
    }, error => this.handleError(error));
  }

  /**
   * User votes no for case.
   */
  no() {
    this.service.vote(this.id, false).subscribe(res => {
      this.item.opinion = false;
      this.snack.open(
        'A cryptographically signed email receipt of your vote was sent to your registered email address. Please keep this email safe somewhere in case of auditing of the system.',
        'ok', {
          duration: 10000,
        });
    }, error => this.handleError(error));
  }

  /**
   * Capitalizes the specified string.
   * 
   * @param region Region to capitalize name of.
   */
  capitalize(region: string) {
    return region.charAt(0).toUpperCase() + region.slice(1);
  }

  /**
   * Returns CSS class for case, which is invoked only if user has voted
   * for the case.
   */
  getClass() {
    if (this.item.opinion) {
      return 'yes';
    } else {
      return 'no';
    }
  }

  private closeInfo() {
    this.firstCase = false;
  }
}
