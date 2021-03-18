
// Angular imports.
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Application specific imports.
import { AnarqService, EntityAvailable, ResultModel } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  /**
   * Username user wants to use on site.
   */
  public username: string;

  /**
   * 'ok' if username is good
   */
  public usernameGood: string = '';

  /**
   * Email address of user.
   */
   public email: string;

   /**
    * 'ok' if email is good.
    */
   public emailGood: string = '';

   /**
    * Full name of user.
    */
   public name: string;

  /**
   * Password user types.
   */
  public password: string;

  /**
   * Password repeat, to avoid writing errors as the user types password.
   */
  public repeatPassword: string;

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService Needed to invoke backend to perform actual registration of user
   */
  constructor(
    private anarqService: AnarqService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  /**
   * Verifies username is not already taken.
   */
  checkUsername() {
    this.anarqService.profile.usernameAvailable(this.username).subscribe((result: EntityAvailable) => {
      if (!result.result) {
        this.snackBar.open(result.message, 'ok', {
          duration: 2000,
        });
        this.usernameGood = 'no';
      } else {
        this.usernameGood = 'ok';
      }
    });
  }

  /**
   * Verifies email address is not already taken.
   */
  checkEmail() {
    this.anarqService.profile.emailAvailable(this.email).subscribe((result: EntityAvailable) => {
      if (!result.result) {
        this.snackBar.open(result.message, 'ok', {
          duration: 2000,
        });
        this.emailGood = 'no';
      } else {
        this.emailGood = 'ok';
      }
    });
  }

  /**
   * Returns true if data is accepted, and submit button can be clicked.
   */
  isGood() {
    if (!this.username || this.username.length === 0) {
      return false;
    }
    if (!this.password || this.password.length === 0 || this.password !== this.repeatPassword) {
      return false;
    }
    if (!this.email || this.email.length === 0 || this.email.indexOf('@') === -1) {
      return false;
    }
    if (!this.name || this.name.length === 0) {
      return false;
    }
    if (this.usernameGood !== 'ok') {
      return false;
    }
    if (this.emailGood !== 'ok') {
      return false;
    }
    return true;
  }

  /**
   * Invoked when user clicks the register button.
   */
  register() {
    this.anarqService.profile.register(this.username, this.password, this.email, this.name).subscribe((result: ResultModel) => {
      if (result.result === 'success') {
        this.snackBar.open('Please check your inbox for an email from AnarQ', 'ok', {
          duration: 5000,
        });
        this.router.navigate(['/']);
      }
    });
  }
}
