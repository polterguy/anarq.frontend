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

  private pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
  };
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

  private pieChartLabels: Label[] = [];
  private barChartLabels: Label[] = [];

  private pieChartData: number[] = [];
  private barChartData: number[] = [];

  private pieChartColors = [{
      backgroundColor: [
        'rgba(200,255,200,0.8)',
        'rgba(255,200,200,0.8)'
      ]}];
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
        if (this.shouldDisplayVotesChart()) {
          this.pieChartData = [
            res.positive,
            res.negative,
          ];
          this.pieChartLabels = [
            'yes',
            'no',
          ];
        }
        if (this.shouldDisplayRegionChart()) {
          this.barChartLabels = this.item.regions.map(x => x.name);
          this.barChartData = this.item.regions.map(x => x.votes);
        }
      });
    });
  }

  shouldDisplayVotesChart() {
    if (!this.item) {
      return false;
    }
    if (this.item.negative === 0 && this.item.positive === 0) {
      return false;
    }
    return true;
  }

  shouldDisplayRegionChart() {
    if (!this.item) {
      return false;
    }
    if (!this.item.regions || this.item.regions.length <= 0) {
      return false;
    }
    return true;
  }
}
