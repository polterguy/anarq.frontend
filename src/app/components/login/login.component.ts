import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { AnarqService, AuthenticateModel } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /**
   * Username model, databound to username textbox.
   */
  public username: string;

  /**
   * Password model, databound to password textbox.
   */
  public password: string;

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService Backend HTTP service allowing us to authenticate user
   */
  constructor(
    private anarqService: AnarqService,
    private stateService: StateService,
    private router: Router) { }

  /**
   * Invoked when login button is clicked.
   */
  login() {
    this.anarqService.profile.authenticate(this.username, this.password).subscribe((result: AuthenticateModel) => {
      this.stateService.ticket = result.ticket;
      this.router.navigate(['/']);
    });
  }
}
