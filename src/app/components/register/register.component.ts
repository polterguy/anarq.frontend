
// Angular imports.
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Application specific imports.
import { AnarqService, EntityAvailable, ResultModel } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  /**
   * Terms and conditions of using site.
   */
  public terms: string = '';

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
   * If true, the post is being submitted.
   */
   public submitting: boolean = false;

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
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Fetching terms and conditions from backend.
    this.anarqService.misc.termsAndConditions().subscribe((result: ResultModel) => {
      this.terms = result.result;
    });
  }

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
    if (this.username.length < 3) {
      return false;
    }
    for (const idx of this.username) {
      if ('abcdefghijklmnopqrstuvwxyz1234567890_-'.indexOf(idx.toLowerCase()) === -1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Invoked when user clicks the register button.
   */
  register() {

    // Making sure we obscure things while post is being submitted.
    this.submitting = true;

    // Invoking backend to register user
    this.anarqService.profile.register(
      this.username,
      this.password,
      this.email,
      this.name).subscribe((result: ResultModel) => {
      if (result.result === 'success') {

        // Providing feedback to user.
        this.submitting = false;
        this.snackBar.open('Please check your inbox for an email from AnarQ', 'ok', {
          duration: 5000,
        });
        this.router.navigate(['/']);
      }
    }, (error: any) => {

      // Oops ...!!
      this.submitting = false;
      this.snackBar.open(error.error.message, 'ok', {
        duration: 5000,
      });
    });
  }
}
