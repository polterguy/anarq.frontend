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
import { BaseComponent } from 'src/app/helpers/base.component';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * This is the component for the main home page, or the
 * landing page at the root URL for the app.
 */
@Component({
  templateUrl: './list-regions.component.html',
  selector: 'app-list-regions',
  styleUrls: ['./list-regions.component.scss']
})
export class ListRegionsComponent extends BaseComponent {

  public regions: string[] = [];
  public filter: string = null;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param router Router to navigate to specific cases, etc.
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
   * Implementation simply returns all open cases, which depends upon whether
   * or not the user is logged in or not.
   */
  protected init() {

    // Making sure we hide language selector.
    this.messages.sendMessage({
      name: Messages.APP_HIDE_LANGUAGE,
    });

    this.getRegions();
  }

  /**
   * @inheritDoc
   * 
   * The only messages we are interested in, is when user logs in and out,
   * since that changes the cases he sees.
   */
  protected initSubscriptions() {
    return null;
  }

  /**
   * Retrieves all relevant regions for currently authenticated user from server.
   */
  public getRegions() {

    // User is authenticated, retrieving user's regions.
    this.service.getRegions().subscribe(res => {
      this.regions = res.regions;
    }, error => this.handleError(error));
  }

  /**
   * Filters regions according to filter condition.
   */
  public filterRegions() {
    if (this.regions === null) {
      return [];
    }
    if (this.filter === null || this.filter === '') {
      return this.regions;
    }
    return this.regions.filter(x => x.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase()));
  }
}
