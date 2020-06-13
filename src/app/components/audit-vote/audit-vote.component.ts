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
  public yes: number = null;
  public no: number = null;

  constructor(
    private route: ActivatedRoute,
    private service: PublicService) { }

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.service.auditVote(pars.hash).subscribe(res => {
        if (res.result === 'SUCCESS') {
          this.voteGood = true;
          this.caseId = res.case;
          this.yes = res.yes;
          this.no = res.no;
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
