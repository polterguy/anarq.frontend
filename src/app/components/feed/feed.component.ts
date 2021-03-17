import { Component, OnInit } from '@angular/core';
import { AnarqService } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  constructor(private service: AnarqService) { }

  ngOnInit() {
    this.service.site.pages().subscribe(result => {
      console.log(result);
    });
  }
}
