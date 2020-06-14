/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/http/public.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audit-vote',
  templateUrl: './audit-vote.component.html',
  styleUrls: ['./audit-vote.component.scss']
})
export class AuditVoteComponent implements OnInit {

  public voteGood: boolean = null;
  public extra: string = null;
  public caseId: number = null;
  public previous: string = null;
  private hash: string;
  private username: string = null;

  constructor(
    private route: ActivatedRoute,
    private service: PublicService) { }

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.hash = pars.hash;
      this.service.auditVote(pars.hash).subscribe(res => {
        if (res.result === 'SUCCESS') {
          this.username = res.username;
          this.voteGood = true;
          this.caseId = res.case;
          if (res.previous) {
            this.previous = res.previous;
          } else {
            this.previous = null;
          }
        } else {
          this.voteGood = false;
          this.extra = res.extra;
        }
      });
    });
  }

  getCssClass() {
    if (this.voteGood === false) {
      return 'danger';
    } else if (this.voteGood === true) {
      return 'good';
    }
  }
}
