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
import { BaseComponent } from 'src/app/helpers/base.components';
import { MessageService } from 'src/app/services/message.service';
import { PublicService } from 'src/app/services/http/public.service';

/**
 * This is the component for verifying the integrity of a receipt.
 */
@Component({
  selector: 'app-audit-vote',
  templateUrl: './audit-vote.component.html',
  styleUrls: ['./audit-vote.component.scss']
})
export class AuditVoteComponent extends BaseComponent {

  public voteGood: boolean = null;
  public extra: string = null;
  public caseId: number = null;
  public previous: string = null;
  private hash: string;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
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
   * Implementation only retrieves vote's integrity from backend.
   */
  protected init() {

    // Retrieving cote's integrity, which depends upon the has URL value.
    this.route.params.subscribe(pars => {
      this.hash = pars.hash;
      this.service.auditVote(pars.hash).subscribe(res => {
        if (res.result === 'SUCCESS') {
          this.voteGood = true;
          this.caseId = res.case;
          if (res.previous) {
            this.previous = res.previous;
          } else {
            this.previous = null;
          }
        } else {
          this.voteGood = false;
          this.extra = res.extra;
        }
      }, error => this.handleError);
    });
  }

  /**
   * @inheritDoc
   * 
   * This component doesn't subscribe to any events, hence it returns
   * null to base class.
   */
  protected initSubscriptions() {
    return null; // We don't care about anything in this component really.
  }

  /**
   * Returns CSS class for vote, which depends upon whether or
   * not the vote's integrity is good or not.
   */
  getCssClass() {
    if (this.voteGood === false) {
      return 'danger';
    } else if (this.voteGood === true) {
      return 'good';
    }
  }
}
