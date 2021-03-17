import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  // Subscriber for messages transmitted by other components and parts of the system.
  private _subscription: Subscription = null;

  /**
   * Creates an instance of your component.
   * 
   * @param stateService Service keeping track of global states required to dender UI correctly
   */
  constructor(
    public stateService: StateService,
    private router: Router) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {
  }

  /**
   * Invoked when user clicks the logout button.
   */
  logout() {
    this.stateService.ticket = null;
    this.router.navigate(['/']);
  }
}
