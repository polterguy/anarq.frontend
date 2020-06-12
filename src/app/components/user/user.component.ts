/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserView } from 'src/app/models/user-view';
import { ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { PublicService } from 'src/app/services/http/public.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public item: UserView = null;

  private barChartOptions: ChartOptions = {
    responsive: true,
    showLines: false,
    scales: {
      display: false,
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
        }
      }]
    },
    legend: {
      display: false
    },
  };

  private barChartLabels: Label[] = [];
  private barChartData: number[] = [];

  private barChartColors = [{
    backgroundColor: [
      'rgba(180,180,180,0.8)',
      'rgba(195,195,195,0.8)',
      'rgba(210,210,210,0.8)',
      'rgba(225,225,225,0.8)',
      'rgba(240,240,240,0.8)',
    ]}];

  constructor(
    private service: PublicService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(pars => {
      this.service.getUser(pars.username).subscribe(res => {
        this.item = res;
        if (this.shouldDisplayRegionChart()) {
          this.barChartLabels = this.item.regions.map(x => x.name);
          this.barChartData = this.item.regions.map(x => x.votes);
        }
      });
    });
  }

  getTotalVotes() {
    let result = 0;
    if (this.item && this.item.regions) {
      this.item.regions.forEach(idx => {
        result += idx.votes;
      });
    }
    return result;
  }

  shouldDisplayRegionChart() {
    if (!this.item) {
      return false;
    }
    if (!this.item.regions || this.item.regions.length <= 0 || this.getTotalVotes() === 0) {
      return false;
    }
    return true;
  }
}
