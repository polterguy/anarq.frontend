
// Angular imports.
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Application specific imports.
import { StateService } from 'src/app/services/state.service';
import { AnarqService, Profile, ResultModel } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {

  /**
   * Model containing data from backend.
   */
  public profile: Profile;

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService Needed to retrieve profile information
   */
  constructor(
    private anarqService: AnarqService,
    private snackBar: MatSnackBar,
    public stateService: StateService) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Retrieving profile information from backend.
    this.anarqService.profile.me().subscribe((result: Profile) => {
      this.profile = result;
    });
  }

  /**
   * Returns roles as comma separated list of values.
   */
  getRoles() {
    return this.profile.roles.join(', ');
  }

  /**
   * Invoked when PayPalID has changed.
   */
  payPalIdChanged() {
    
    // Storing PayPalID by invoking backend.
    this.anarqService.profile.storePayPalId(this.profile.payPalId).subscribe(() => {

      // Success!
      if (this.profile.payPalId === '') {
        this.snackBar.open('Your PayPal ID was successfully removed', 'ok', {
          duration: 5000,
        });
      } else {
        this.snackBar.open('Your PayPal ID was successfully updated', 'ok', {
          duration: 5000,
        });
      }
    }, (error: any) => {

      // Oops ...!!
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      });
    });
  }
}
