
// Angular imports.
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Application specific imports.
import { AnarqService } from '../services/anarq.service';
import { StateService } from '../services/state.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  // Subscriber for messages transmitted by other components and parts of the system.
  private _subscription: Subscription = null;

  /**
   * True if donations are turned on for the site.
   */
  public donations: boolean = false;

  /**
   * Creates an instance of your component.
   * 
   * @param stateService Service keeping track of global states required to dender UI correctly
   */
  constructor(
    public stateService: StateService,
    private messageService: MessageService,
    private anarqService: AnarqService,
    private router: Router) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {
    this.anarqService.misc.donations().subscribe((result: boolean) => {
      this.donations = result;
    });
  }

  /**
   * Invoked when user clicks the logout button.
   */
  logout() {
    this.stateService.ticket = null;
    this.router.navigate(['/']);
    this.messageService.sendMessage({
      name: 'app.logout'
    });
  }
}
