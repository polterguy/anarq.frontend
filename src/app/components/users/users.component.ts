/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

/*
 * Custom imports for component.
 */
import { UserSlimModel } from 'src/app/models/user-slim-model';
import { BaseComponent } from 'src/app/helpers/base.components';
import { MessageService } from 'src/app/services/message.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PublicService } from 'src/app/services/http/public.service';

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

  // Users currently viewed.
  private users: UserSlimModel[] = [];

  // If true, there are more items.
  private more = false;

  private filter: FormControl;

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
    this.filter = new FormControl('');
    this.filter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(query => {
        this.users = [];
        this.getNextBatch();
      });
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
    let filter = null;
    if (this.filter.value.length > 0) {
      filter = this.filter.value;
    }
    this.service.getUsers(this.offset, filter).subscribe(res => {
      this.more = res.length === 25;
      this.users = this.users.concat(res);
    });
  }
}
