/*
 * AnarQ, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

/*
 * Common system imports.
 */
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/*
 * Custom imports for component.
 */
import { PublicService } from 'src/app/services/http/public.service';
import { BaseComponent } from 'src/app/helpers/base.component';
import { MessageService, Messages } from 'src/app/services/message.service';

/**
 * Component for verifying your email address.
 * 
 * Component automatically logs in user, and redirects
 * him immediately to component for setting up regions.
 */
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent extends BaseComponent {

  private success: boolean = null;

  /**
   * Constructor for component.
   * 
   * @param service Service to retrieve data from server.
   * @param messages Message publishing/subscription bus service.
   * @param snack Snack bar required by base class to show errors.
   * @param route Necessary to retrieve hash for verifying email address of user.
   * @param router Necessary to redirect user after having setup his regions.
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
   * Implementation simply verifies user's email address, and logs him in
   * immediately afterwards, if success.
   */
  protected init() {
    this.route.params.subscribe(pars => {
      this.service.verifyEmail({
        username: pars.username,
        hash: pars.hash,
      }).subscribe(res => {
        if (res.result === 'SUCCESS') {
          this.success = true;
          this.messages.sendMessage({
            name: Messages.APP_LOGIN,
            content: res.extra
          });
          this.snack.open(
            this.translate('TicketValidNowTellRegion'),
            'ok', {
              duration: 5000,
            });
            setTimeout(() => this.router.navigate(['/setup-regions']), 2000);
        } else {
          this.success = false;
          this.snack.open(
            res.extra,
            'ok', {
              duration: 5000,
            });
            setTimeout(() => this.router.navigate(['/']), 2000);
        }
      });
    }, error => this.handleError(error));
  }

  /**
   * @inheritDoc
   * 
   * Component is not really interested in any messages.
   */
  protected initSubscriptions() {
    return null;
  }
}
