
// Angular imports.
import { Component, OnInit } from '@angular/core';

// Application specific imports.
import { StateService } from 'src/app/services/state.service';
import { AnarqService, Profile } from 'src/app/services/anarq.service';

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
}
