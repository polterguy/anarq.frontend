import { Component, OnInit } from '@angular/core';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';
import { AnarqService, ResultModel } from 'src/app/services/anarq.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  /**
   * PayPal donate configuration.
   */
  public payPalConfig? : IPayPalConfig;

  constructor(private anarqService: AnarqService) { }

  /**
   * Implementation of OnInit.
   */
  ngOnInit() {

    // Configuring PayPal donate button.
    this.initConfig();
  }

  /*
   * Invoked when PayPal donate button needs to be configured.
   */
  private initConfig() {

    // Retrieving PayPal client ID before initializing PayPal component.
    this.anarqService.misc.payPalClientId().subscribe((res: ResultModel) => {
      this.payPalConfig = {
        currency: 'EUR',
        clientId: res.result,
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: '10',
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: '10'
                        }
                    }
                },
                items: [{
                    name: 'AnarQ Donation',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'EUR',
                        value: '10',
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);

        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
    });
  }
}
