
// Angular imports.
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Application specific imports.
import { AnarqService, AuthenticateModel } from 'src/app/services/anarq.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService Needed to confirm email address towards backend
   */
  constructor(
    private anarqService: AnarqService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Subscribing to query parameters to retrieve email and secret.
    this.route.queryParams.subscribe((params: any) => {
      const email = params['email'];
      const secret = params['secret'];
      this.anarqService.profile.confirmEmail(email, secret).subscribe((result: AuthenticateModel) => {

        // Success, storing JWT token in state service.
        localStorage.setItem('ticket', result.ticket);
        
        // Informing user that he successfully verified his email address, and redirecting to avoid revealing secret.
        this.snackBar.open('You successfully verified your email address, you can now post, comment and like posts', 'ok', {
          duration: 10000,
        });
        this.router.navigate(['/']);

      }, (error: any) => {

        // Oops ...!!
        this.snackBar.open(error.error.error, 'ok', {
          duration: 5000,
        });
      });
    });
  }
}
