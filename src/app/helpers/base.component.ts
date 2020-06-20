
/*
 * System imports.
 */
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { OnInit, OnDestroy } from '@angular/core';

/*
 * Custom imports for component.
 */
import { TranslationModel } from '../models/translation-model';
import { PublicService } from '../services/http/public.service';
import { MessageService, Messages } from '../services/message.service';


/**
 * Base class for components, providing common functionality, such
 * as error handling, etc.
 */
export abstract class BaseComponent implements OnInit, OnDestroy {

  /**
   * Contains all translated entities in the system.
   */
  protected static translations: TranslationModel[] = [];

  /**
   * Translates the specified key into the user's selected language.
   * 
   * @param key Key to look for
   * @param args Arguments to translator
   */
  public static translate(key: string, args: string[] = null) {
    const result = BaseComponent.translations.filter(x => x.key === key);
    let returnValue = key;
    if (result && result.length > 0) {
      returnValue = result[0].content;
      if (args && args.length > 0) {
        for(var idx = 0; idx < args.length; idx++) {
          returnValue = returnValue.replace('{' + idx + '}', args[idx]);
        }
      }
    }
    return returnValue; // Defaulting to key value, which normally is English'ish.
  }

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

    /*
     * Making sure we show registration link by default
     * This logic allows us to "override" displaying of
     * register link in sub-components, by sending the
     * message that should hide the register link in init()
     * method.
     */
    setTimeout(() => {
      this.messages.sendMessage({
        name: Messages.APP_SHOW_LOGIN_REGISTER,
      });
    }, 1);
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
      this.translate(error.error?.message || (error.status + ' - ' + error.statusText)),
      'ok', {
        duration: 5000
      });
  }

  /**
   * Translates the specified key according to user's language selection.
   * 
   * @param key Key to lookup translations
   * @param args Arguments to key, will be applied using string interpolation
   */
  public translate(key: string, args: any[] = null) {
    const result = BaseComponent.translations.filter(x => x.key === key);
    let returnValue = key;
    if (result && result.length > 0) {
      returnValue = result[0].content;
      if (args && args.length > 0) {
        for(var idx = 0; idx < args.length; idx++) {
          returnValue = returnValue.replace('{' + idx + '}', args[idx]);
        }
      }
    }
    return returnValue; // Defaulting to key value, which normally is English'ish.
  }

  /**
   * Capitalizes region's name, making sure it starts with a CAPS character.
   * 
   * @param region Region name
   */
  public capitalize(region: string) {
    return region.charAt(0).toUpperCase() + region.slice(1);
  }
}
