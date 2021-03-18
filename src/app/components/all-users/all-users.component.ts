import { Component, OnInit } from '@angular/core';
import { AnarqService, UserExcerpt } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  /**
   * Model for users.
   */
  public users: UserExcerpt[];

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService Needed to fetch users from backend
   */
  constructor(private anarqService: AnarqService) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Fetching first batch of users.
    this.getUsers();
  }

  /**
   * Invoked when user wants to fetch more users.
   */
  getUsers() {
    this.anarqService.users.list(25, 0).subscribe((result: UserExcerpt[]) => {
      this.users = result;
    });
  }
}
