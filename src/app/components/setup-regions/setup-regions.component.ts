/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

/*
 * Custom imports for component.
 */
import { RegionsModel } from 'src/app/models/regions-model';
import { BaseComponent } from 'src/app/helpers/base.component';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * This is the component for setting up user's regions.
 * This is in general terms only allowed initially, as the
 * user confirm his email, during the registration process.
 */
@Component({
  selector: 'app-setup-regions',
  templateUrl: './setup-regions.component.html',
  styleUrls: ['./setup-regions.component.scss']
})
export class SetupRegionsComponent extends BaseComponent {

  private regions: RegionsModel = null;
  private filter: string = null;
  private isLoggedIn = false;
  private canSetRegions = false;
  private whyVisible = false;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param router Necessary to redirect user after having setup his regions.
   */
  constructor(
    protected service: PublicService,
    protected messages: MessageService,
    protected snack: MatSnackBar,
    private router: Router)
  {
    super(service, messages, snack);
  }

  /**
   * @inheritDoc
   * 
   * Implementation simply retrieves all regions from backend.
   */
  protected init() {
    this.checkIfUserCanSetRegions();
  }

  /**
   * @inheritDoc
   * 
   * The only messages we are interested in, is when user logs in and out,
   * since that changes whether or not he is allowed to setup his regions or not.
   */
  protected initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messages.getMessage().subscribe(msg => {

      switch (msg.name) {

        /*
         * If user logs out, he (obviously) cannot change his regions,
         * and we redirect him to landing page of app.
         */
        case Messages.APP_LOGGED_OUT:
          this.canSetRegions = false;
          this.isLoggedIn = false;
          this.router.navigate(['/']);
          break;

        case Messages.APP_LOGGED_IN:
          this.checkIfUserCanSetRegions();
          this.isLoggedIn = true;
          break;
      }
    });
  }

  /**
   * Returns regions filtered to caller, allowing user to filter regions,
   * to look for his specific region in the system.
   */
  private getFilteredRegions() {
    if (this.regions === null) {
      return [];
    }
    if (this.filter === null || this.filter === '') {
      return this.regions.regions;
    }
    return this.regions.regions.filter(x => x.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase()));
  }

  /**
   * Checks to see if user can set his region.
   */
  private checkIfUserCanSetRegions() {
    this.isLoggedIn = this.messages.getValue(Messages.APP_GET_USERNAME);
    if (this.isLoggedIn) {
      this.service.canSetRegions().subscribe(res => {
        this.canSetRegions = res.result === 'SUCCESS';
        this.service.getRegions().subscribe(res => {
          this.regions = res;
        }, error => this.handleError(error));
      }, error => this.handleError(error));
    } else {
      this.canSetRegions = false;
    }
  }

  /**
   * Shows the reasons why we ask the user where he or she lives.
   */
  private showWhy() {
    this.whyVisible = true;
  }

  /**
   * Selects a region on behalf of the user, and redirects him to
   * the landing page afterwards.
   * 
   * @param region Which region user selected.
   */
  private selectRegion(region: string) {
    this.service.setRegion(region).subscribe(res => {
      if (res.result === 'SUCCESS') {
        this.router.navigate(['/'])
        this.snack.open(
          this.translate('Congratulations'),
          'ok', {
            duration: 5000,
          });
      } else {
        this.snack.open(
          res.extra,
          'ok', {
            duration: 5000,
          });
      }
    }, error => this.handleError(error));
  }
}
