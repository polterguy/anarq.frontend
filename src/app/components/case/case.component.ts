/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
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
import { BaseComponent } from 'src/app/helpers/base.component';
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

  public item: CaseView = null;
  public id: number;
  public isLoggedIn = false;
  public firstCase = false;

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
  public getCaseData() {
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
      if (res.result === 'SUCCESS') {
        this.item.opinion = true;
        this.snack.open(
          this.translate('CryptoReceiptSent'),
          'ok', {
            duration: 10000,
          });
      } else {
        this.snack.open(
          this.translate(res.extra),
          'ok', {
            duration: 10000,
          });
      }
    }, error => this.handleError(error));
  }

  /**
   * User votes no for case.
   */
  no() {
    this.service.vote(this.id, false).subscribe(res => {
      this.item.opinion = false;
      this.snack.open(
        this.translate('CryptoReceiptSent'),
        'ok', {
          duration: 10000,
        });
    }, error => this.handleError(error));
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

  /**
   * Closes additional info for first created case.
   */
  public closeInfo() {
    localStorage.removeItem('first_case');
    this.firstCase = false;
  }

  /**
   * Returns a friendly string declaring whether ot not case was won or lost
   */
  public getCaseResult() {
    if (this.item.positive > this.item.negative) {
      return this.translate('CaseWasWon');
    } else if (this.item.positive < this.item.negative) {
      return this.translate('CaseWasLost');
    } else {
      return this.translate('CaseWasNotDetermined');
    }
  }

  /**
   * Returns CSS class for case, which is dependent upon whether or not
   * case is still open, or if it is closed, whether or not the case was won,
   * lost or not determined.
   */
  public getCssClassForCase() {
    if (this.item.closed === 0) {
      // Case is still open.
      return 'open';
    } else {
      if (this.item.positive > this.item.negative) {
        return 'won';
      } else if (this.item.positive < this.item.negative) {
        return 'lost';
      } else {
        return 'indetermined';
      }
    }
  }
}
