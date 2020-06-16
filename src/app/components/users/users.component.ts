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
import { UserSlimModel } from 'src/app/models/user-slim-model';
import { BaseComponent } from 'src/app/helpers/base.components';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * Component for viewing users registered at site.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent {

  // Offset from where to start fetching users.
  private offset = 0;
  private users: UserSlimModel[] = [];
  private more = false;

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
    protected snack: MatSnackBar)
  {
    super(service, messages, snack);
  }

  /**
   * @inheritDoc
   * 
   * Fetching first 25 users.
   */
  protected init() {
    this.getNextBatch();
  }

  /**
   * @inheritDoc
   */
  protected initSubscriptions() {
    return null;
  }

  /**
   * Retrieves next batch of users from backend.
   */
  private getNextBatch() {
    this.offset += this.users.length;
    this.service.getUsers(this.offset).subscribe(res => {
      this.more = res.length === 25;
      this.users = this.users.concat(res);
    });
  }
}
