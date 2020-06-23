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
 * Helper library imports.
 */
import { Label } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

/*
 * Custom imports for component.
 */
import { UserView } from 'src/app/models/user-view';
import { CaseSlim } from 'src/app/models/case-slim';
import { BaseComponent } from 'src/app/helpers/base.component';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * Component for viewing users registered at site.
 */
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent {

  // User's information.
  public item: UserView = null;

  // All cases user has suggested.
  public cases: CaseSlim[] = null;

  // Bar chart options, and data.
  public barChartOptions: ChartOptions = {
    responsive: true,
    showLines: false,
    scales: {
      display: false,
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
        }
      }]
    },
    legend: {
      display: false
    },
  };
  public barChartLabels: Label[] = [];
  public barChartData: number[] = [];
  public barChartColors = [{
    backgroundColor: [
      'rgba(180,180,180,0.8)',
      'rgba(195,195,195,0.8)',
      'rgba(210,210,210,0.8)',
      'rgba(225,225,225,0.8)',
      'rgba(240,240,240,0.8)',
    ]}];

  // Bar chart options, and data.
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartColors = [{
    backgroundColor: [
      'rgba(180,255,180,0.8)',
      'rgba(255,180,180,0.8)',
      'rgba(180,180,180,0.8)',
    ]}];

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param route Activated route service to allow us to figure out which user was requested.
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
   * We just fetch the user data here.
   */
  protected init() {

    // Making sure we display language selector.
    this.messages.sendMessage({
      name: Messages.APP_HIDE_LANGUAGE,
    });

    this.fetchUser();
  }

  /**
   * @inheritDoc
   * 
   * We're only interested in handling when the user is logging in, since
   * that prohibits him from registering again, and we redirect him to the
   * main landing page of the site if he does.
   */
  protected initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messages.getMessage().subscribe(msg => {

      switch (msg.name) {

        /*
         * The only message we're really interested in, is when user is logging in,
         * or logging out, at which point we fetch the user data again, since the
         * authenticated user might be a moderator, admin, or root user.
         */
        case Messages.APP_LOGGED_IN:
          this.fetchUser();
          break;

        case Messages.APP_LOGGED_OUT:
          this.fetchUser();
          break;
      }
    });
  }

  /**
   * Fetches the user from the backend.
   */
  public fetchUser() {

    // Need to parse parameters to figure out what user to retrieve.
    this.route.params.subscribe(pars => {
      this.service.getUser(pars.username).subscribe(res => {
        this.item = res;
        if (this.shouldDisplayRegionChart()) {
          this.barChartLabels = this.item.regions.map(x => x.name);
          this.barChartData = this.item.regions.map(x => x.votes);
        }
        if (this.shouldDisplayWinningsChart()) {
          this.pieChartLabels = [
            this.translate('WonCases'),
            this.translate('LostCases'),
            this.translate('TiedCases')];
          this.pieChartData = [this.item.won, this.item.lost, this.item.tied];
        }
        this.service.getUserCases(pars.username).subscribe(res => {
          this.cases = res;
        }, error => this.handleError(error));
      }, error => this.handleError(error));
    });
  }

  /**
   * Returns the total number of votes user has voted over.
   */
  public getTotalVotes() {
    let result = 0;
    if (this.item && this.item.regions) {
      this.item.regions.forEach(idx => {
        result += idx.votes;
      });
    }
    return result;
  }

  /**
   * Returns true if region chart is supposed to be displayed.
   */
  public shouldDisplayRegionChart() {
    if (!this.item) {
      return false;
    }
    if (!this.item.regions ||
      this.item.regions.length <= 0 ||
      this.getTotalVotes() === 0) {
      return false;
    }
    return true;
  }

  /**
   * Returns true if winnings chart is supposed to be displayed.
   */
  public shouldDisplayWinningsChart() {
    if (!this.item) {
      return false;
    }
    if (this.item.won > 0 || this.item.lost > 0 || this.item.tied > 0) {
      return true;
    }
    return false;
  }
}
