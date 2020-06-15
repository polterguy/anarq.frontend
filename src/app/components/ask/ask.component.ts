/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
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
import { BaseComponent } from 'src/app/helpers/base.components';
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

  private subject: FormControl;
  private region: string;
  private isLoggedIn = false;
  private canCreateCase = false;
  private subjectGood?: boolean = null;
  private body = ''

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
    this.isLoggedIn = this.messages.getValue(Messages.APP_GET_USERNAME);
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
  private checkIfUserCanCreateCase() {

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
    }, error => this.handleError);
  }

  /**
   * Returns the CodeMirror options for the HTML parts of the component.
   */
  private getCodeMirrorOptions() {
    return {
      lineNumbers: true,
      theme: 'material',
      mode: 'markdown'
    };
  }

  /**
   * Submits the question to the backend.
   */
  submit() {
    this.service.submitCase({
      subject: this.subject.value,
      body: this.body,
      region: this.region,
    }).subscribe(res => {
      if (res.result === 'SUCCESS') {
        this.router.navigate(['/case/' + res.extra]);
      } else {
        this.snack.open(
          res.extra, 
          'ok', {
            duration: 5000
          });
      }
    }, error => this.handleError);
  }
}
