
/*
 * System imports.
 */
import { MatSnackBar } from '@angular/material';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/*
 * Custom imports for component.
 */
import { MessageService } from '../services/message.service';
import { PublicService } from '../services/http/public.service';


/**
 * Base class for components, providing common functionality, such
 * as error handling, etc.
 */
export abstract class BaseComponent implements OnInit, OnDestroy {

  /**
   * Message service subscription, allowing us to communicate with other components
   * in a publish/subscribe manner.
   */
  protected messageSubscription: Subscription;

  /**
   * Constructor for class.
   * 
   * @param service HTTP service to retrieve data from the backend.
   * @param messages Message service to use for publish/subscribe events.
   * @param snack Snackbar to use for displaying messages.
   */
  constructor(
    protected service: PublicService,
    protected messages: MessageService,
    protected snack: MatSnackBar) { }

  /**
   * Implementation of OnInit.
   * 
   * Will invoked init() abstract method, to allow inherited component
   * to initialize whatever it needs to initialize.
   */
  ngOnInit() {
    this.messageSubscription = this.initSubscriptions();
    this.init();
  }

  /**
   * Implementation of OnDestroy.
   */
  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  /**
   * Init method, invoked when component is initialized.
   */
  protected abstract init() : void;

  /**
   * Abstract method you must implement when deriving from class, to be able to handle
   * messages and events using the publish/subscribe pattern.
   */
  protected abstract initSubscriptions() : Subscription;

  /**
   * Handles an error for you.
   * 
   * @param error Error as returned from server.
   */
  protected handleError(error: any) {
    console.error(error);
    this.snack.open(
      error.error.message,
      'ok', {
        duration: 5000
      });
  }
}
