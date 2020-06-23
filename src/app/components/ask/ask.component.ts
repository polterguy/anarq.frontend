/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/*
 * Custom imports for component.
 */
import { BaseComponent } from 'src/app/helpers/base.component';
import { PublicService } from 'src/app/services/http/public.service';
import { MessageService, Messages } from 'src/app/services/message.service';


/**
 * This is the component for asking a question.
 */
@Component({
  selector: 'app-ask',
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.scss']
})
export class AskComponent extends BaseComponent {

  public subject: FormControl;
  public region: string;
  public isLoggedIn = false;
  public canCreateCase = false;
  public subjectGood?: boolean = null;
  public body = '';
  public showInfo = false;
  public deadline: string = 'short';

  // Number of milliseconds after a keystroke before filtering should be re-applied.
  private debounce = 800;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param rounter Necessary to redirect user asfter process is done.
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
   * Implementation initializes FormControl for subject, and checks if
   * user is allowed to ask a question in current region.
   */
  protected init() {

    // Making sure we display language selector.
    this.messages.sendMessage({
      name: Messages.APP_HIDE_LANGUAGE,
    });

    // Making sure we initialize subject FormControl.
    this.subject = new FormControl('');
    this.subject.valueChanges
      .pipe(debounceTime(this.debounce / 10), distinctUntilChanged())
      .subscribe(query => {
        if (this.subject.value.length >= 15 &&
          this.subject.value.length <= 100 &&
          this.subject.value.endsWith('?')) {
          this.subjectGood = true;
        } else if (this.subject.value.length === 0) {
          this.subjectGood = null;
        } else {
          this.subjectGood = false;
        }
      });

    // Checking if user is allowed to ask questions in this region.
    this.checkIfUserCanCreateCase();

    // Verifying user is logged in.
    this.isLoggedIn = this.messages.getValue(Messages.APP_GET_USERNAME) !== null;

    /*
     * Checking if this is user's first case, at which point we show
     * the general information about how to create a new case.
     */
    this.service.isFirstCase().subscribe(res => {
      this.showInfo = res.first;
      if (this.showInfo) {
        localStorage.setItem('first_case', JSON.stringify(res));
      } else {
        localStorage.removeItem('first_case');
      }
    }, error => this.handleError(error));
  }

  /**
   * @inheritDoc
   * 
   * We are only interested in logging out and in of the system, since
   * that changes whether or not user is allowed to ask a question or not.
   */
  protected initSubscriptions() {

    /*
     * Making sure we subscribe to relevant messages.
     */
    return this.messages.getMessage().subscribe(msg => {

      switch (msg.name) {

        /*
         * The only message we really care about, is when user logs in or out,
         * at which point user's ability to ask questions might change.
         */
        case Messages.APP_LOGGED_OUT:
          this.isLoggedIn = false;
          this.canCreateCase = false;
          break;

        case Messages.APP_LOGGED_IN:
          this.isLoggedIn = true;
          this.checkIfUserCanCreateCase();
          break;
      }
    });
  }

  /**
   * Checks to see if user can ask a question in current region or not.
   */
  public checkIfUserCanCreateCase() {

    // Retrieving username first.
    const username = this.messages.getValue(Messages.APP_GET_USERNAME);

    // Figuring out if user is allowed to ask qustions in this region or not.
    this.route.params.subscribe(pars => {
      this.region = pars.region;
      if (username) {
        this.service.canCreateCase(this.region).subscribe(res => {
          this.canCreateCase = res.result === 'SUCCESS';
        });
      }
    }, error => this.handleError(error));
  }

  /**
   * Submits the case to the backend.
   */
  public submit() {
    this.service.submitCase({
      subject: this.subject.value,
      body: this.body,
      region: this.region,
      deadline: this.deadline,
    }).subscribe(res => {
      if (res.result === 'SUCCESS') {
        this.snack.open(
          this.translate('CaseSuccessfullyCreated'),
          'ok', {
            duration: 10000,
          });
          this.router.navigate(['/case/' + res.extra]);
        } else {
        this.snack.open(
          this.translate(res.extra), 
          'ok', {
            duration: 5000
          });
      }
    }, error => this.handleError(error));
  }

  /**
   * Closes information content box.
   */
  public closeInfo() {
    this.showInfo = false;
  }
}
