/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

/*
 * Custom imports for component.
 */
import { UserSlimModel } from 'src/app/models/user-slim-model';
import { BaseComponent } from 'src/app/helpers/base.component';
import { MessageService, Messages } from 'src/app/services/message.service';
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
  public offset = 0;

  // Users currently viewed.
  public users: UserSlimModel[] = [];

  public filter: FormControl;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param activatedRoute Necessary to parse query parameters.
   */
  constructor(
    protected service: PublicService,
    protected messages: MessageService,
    protected snack: MatSnackBar,
    private activatedRoute: ActivatedRoute)
  {
    super(service, messages, snack);
  }

  /**
   * @inheritDoc
   * 
   * Fetching first 25 users.
   */
  protected init() {

    // Making sure we hide language selector.
    this.messages.sendMessage({
      name: Messages.APP_HIDE_LANGUAGE,
    });

    this.filter = new FormControl('');
    this.filter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(query => {
        this.offset = 0;
        this.getUsers();
      });

    // Figuring out offset to use.
    this.activatedRoute.queryParams.subscribe(res => {
      if (res && res.offset) {
        this.offset = res.offset;
      }
      this.getUsers();
    });
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
  public getUsers() {
    let filter = null;
    if (this.filter.value.length > 0) {
      filter = this.filter.value;
    }
    this.service.getUsers(this.offset, filter).subscribe(res => {
      this.users = res || [];
    });
  }
}
