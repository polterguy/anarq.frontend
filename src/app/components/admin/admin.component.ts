
// Angular imports.
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Application specific imports.
import { Affected, AnarqService, ResultModel, Topic } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  /**
   * Model for topics.
   */
  public topics: Topic[];

  /**
   * Model for new topic name.
   */
  public name: string;

  /**
   * Model for new topic description.
   */
  public description: string;

  /**
   * Creates an instance of your component.
   * 
   * @param anarqService Needed to retrieve data from backend
   */
  constructor(
    private anarqService: AnarqService,
    private snackBar: MatSnackBar) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Retrieving topics.
    this.getTopics();
  }

  /**
   * Invoked when topics needs to be retrieved.
   */
  getTopics() {
    this.anarqService.topics.listNoCache().subscribe((result: Topic[]) => {
      this.topics = result;
    });
  }

  /**
   * Returns true if new topic can be submitted.
   */
  isGood() {
    const result = this.name && this.name.length >= 3 && this.description && this.description.length > 10;
    if (!result) {
      return false;
    }
    for (const idx of this.name) {
      if ('abcdefghijklmnopqrstuvwxyz-1234567890'.indexOf(idx.toLowerCase()) === -1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Invoked when user wants to save a new topic.
   */
  submitNewTopic() {
    this.anarqService.topics.create(this.name, this.description).subscribe((result: ResultModel) => {
      this.name = '';
      this.description = '';
      this.snackBar.open('Topic was created. Notice, due to caching it might take some time before disappearing', 'ok', {
        duration: 5000,
      });
      this.getTopics();
    });
  }

  /**
   * Invoked when user wants to delete an existing topic.
   * 
   * @param topic Topic to delete
   */
  deleteTopic(topic: Topic) {
    this.anarqService.topics.delete(topic.name).subscribe((result: Affected) => {
      this.snackBar.open('Topic was deleted. Notice, due to caching it might take some time before disappearing', 'ok', {
        duration: 5000,
      });
      this.getTopics();
    });
  }
}
