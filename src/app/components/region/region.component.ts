/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseView } from 'src/app/models/case-view';
import { PublicService } from 'src/app/services/http/public.service';
import { ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { CaseSlim } from 'src/app/models/case-slim';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {

  public cases: CaseSlim[];
  private more: boolean;
  public region: string = null;

  constructor(
    private service: PublicService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.region = pars.region;
      this.service.getOpenCases(null, pars.region).subscribe(res => {
        this.cases = res;
        this.more = res !== null && res.length === 5;
      });
    });
  }
}
