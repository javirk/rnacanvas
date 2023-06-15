import './global.css';

import { LoadingScreen } from './loading-screen/LoadingScreen';

import { App } from 'App';

import * as React from 'react';

import { WelcomePage } from 'Forms/welcome/WelcomePage';

import { DragAndDropDisabler } from 'Utilities/DragAndDropDisabler';

import { userIsTyping } from 'Utilities/userIsTyping';

import { BeforeLeavingHandler } from './before-leaving/BeforeLeavingHandler';
import { ShouldAskBeforeLeavingIndicator } from './before-leaving/ShouldAskBeforeLeavingIndicator';
import { NonEmptyDrawingIndicator } from './before-leaving/NonEmptyDrawingIndicator';
import { AskBeforeLeavingSettingIsToggledIndicator } from './before-leaving/AskBeforeLeavingSettingIsToggledIndicator';

let loadingScreen = new LoadingScreen();
loadingScreen.show();

setTimeout(() => {
  let app = new App();

  setTimeout(() => {
    app.appendTo(document.body);
  }, 25);

  // prerender welcome page under loading screen
  // (seems to help prevent flash of unstyled text)
  setTimeout(() => {
    app.formContainer.renderForm(() => <WelcomePage app={app} />);
  }, 50);

  // page will probably be fully loaded after 2.75 seconds
  setTimeout(() => {
    // hide prerendered welcome page
    app.formContainer.unmountForm();

    // wait a little bit
    // (to make sure prerendered welcome page has been hidden)
    setTimeout(() => {
      loadingScreen.hide().then(() => {
        app.formContainer.renderForm(() => <WelcomePage app={app} />);
      });
    }, 25);
  }, 2750);

  /**
   * Disable drag and drop throughout the app.
   *
   * This is meant to prevent the default web browser drag and drop
   * behavior when elements in the drawing of the app are being
   * dragged around.
   */
  setTimeout(() => {
    let dragAndDropDisabler = new DragAndDropDisabler();
    dragAndDropDisabler.applyTo(document.body);
  }, 25);

  // prevent text selection after double-click
  // when the user is not typing
  document.addEventListener('mousedown', event => {
    // cannot simply listen for the dblclick event since text selection
    // seems to happen before dblclick events are dispatched
    if (event.detail > 1 && !userIsTyping()) {
      event.preventDefault();
    }
  }, false);

  setTimeout(() => {
    let beforeLeavingHandler = new BeforeLeavingHandler({
      shouldAskBeforeLeaving: new ShouldAskBeforeLeavingIndicator({
        requirementsIndicators: [
          new NonEmptyDrawingIndicator({ app }),
          new AskBeforeLeavingSettingIsToggledIndicator({ app }),
        ],
      }),
      warningMessage: 'Are you sure?',
    });

    window.addEventListener('beforeunload', event => {
      beforeLeavingHandler.handle(event);
    });
  }, 25);
}, 50);
