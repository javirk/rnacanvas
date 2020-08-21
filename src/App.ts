import * as ReactDOM from 'react-dom';
import { ReactElement } from 'react';
import './App.css';
import { AppInterface, FormFactory } from './AppInterface';

import {
  fillInBodyForApp,
  getMenuContainer,
  getDrawingContainer,
  getFormContainer,
  getInfobarContainer,
} from './fillInBodyForApp';

import UndoRedo from './undo/UndoRedo';

import StrictDrawing from './draw/StrictDrawing';
import { StrictDrawingSavableState } from './draw/StrictDrawingInterface';
import * as Svg from '@svgdotjs/svg.js';
import StrictDrawingInteraction from './draw/interact/StrictDrawingInteraction';

import createMenuForApp from './menu/createMenuForApp';
import createInfobarForApp from './infobar/createInfobarForApp';

import renderCreateNewDrawingInApp from './forms/new/renderCreateNewDrawingInApp';

import saveDrawingForApp from './export/saveDrawingForApp';

class App implements AppInterface {
  _SVG: () => Svg.Svg;
  _undoRedo: UndoRedo<StrictDrawingSavableState>;
  _strictDrawing!: StrictDrawing;
  _strictDrawingInteraction!: StrictDrawingInteraction;
  _currFormFactory?: () => ReactElement;

  constructor(SVG: () => Svg.Svg) {
    this._SVG = SVG;

    fillInBodyForApp();

    this._initializeDrawing();
    this._undoRedo = new UndoRedo();
    this._initializeDrawingInteraction();
    this.renderPeripherals();

    this._setBindings();

    renderCreateNewDrawingInApp(this);
  }

  get SVG(): () => Svg.Svg {
    return this._SVG;
  }

  _initializeDrawing() {
    this._strictDrawing = new StrictDrawing();
    let container = getDrawingContainer() as Element;
    this._strictDrawing.addTo(container, () => this.SVG());
  }

  get strictDrawing(): StrictDrawing {
    return this._strictDrawing;
  }

  _initializeDrawingInteraction() {
    this._strictDrawingInteraction = new StrictDrawingInteraction(
      this.strictDrawing
    );
    this._strictDrawingInteraction.onShouldPushUndo(() => {
      this.pushUndo();
    });
    this._strictDrawingInteraction.onChange(() => {
      this.renderPeripherals();
    });
    this._strictDrawingInteraction.onRequestToRenderForm(ff => {
      this.renderForm(close => ff(close));
    });
  }

  get strictDrawingInteraction(): StrictDrawingInteraction {
    return this._strictDrawingInteraction;
  }

  renderPeripherals() {
    this.renderMenu();
    this.renderInfobar();
    if (this._currFormFactory) {
      this.renderForm(this._currFormFactory);
    }
    this.updateDocumentTitle();
  }

  renderMenu() {
    ReactDOM.render(
      createMenuForApp(this),
      getMenuContainer(),
    );
  }

  renderInfobar() {
    ReactDOM.render(
      createInfobarForApp(this),
      getInfobarContainer(),
    );
  }

  renderForm(formFactory: FormFactory) {

    /* Seems to be necessary for user entered values (e.g. in input elements)
    to be updated in a currently rendered form. */
    this.unmountCurrForm();

    let close = () => {
      if (this._currFormFactory == formFactory) {
        this.unmountCurrForm();
      }
    }
    ReactDOM.render(
      formFactory(close),
      getFormContainer(),
    );
    this._currFormFactory = formFactory;
  }

  unmountCurrForm() {
    this._currFormFactory = undefined;
    let container = getFormContainer();
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
    }
  }

  updateDocumentTitle() {
    if (this.strictDrawing.isEmpty()) {
      document.title = 'RNA2Drawer 2';
      return;
    }
    document.title = this.strictDrawing.sequenceIds().join(', ');
  }

  pushUndo() {
    this._undoRedo.pushUndo(
      this.strictDrawing.savableState()
    );
    this.renderPeripherals();
  }

  canUndo(): boolean {
    return this._undoRedo.canUndo();
  }

  undo() {
    if (!this.canUndo()) {
      return;
    }
    let currState = this.strictDrawing.savableState();
    this.strictDrawing.applySavedState(
      this._undoRedo.undo(currState)
    );
    this.drawingChangedNotByInteraction();
  }

  canRedo(): boolean {
    return this._undoRedo.canRedo();
  }

  redo() {
    if (!this.canRedo()) {
      return;
    }
    let currState = this.strictDrawing.savableState();
    this.strictDrawing.applySavedState(
      this._undoRedo.redo(currState)
    );
    this.drawingChangedNotByInteraction();
  }

  _setBindings() {
    document.addEventListener('keydown', event => {
      let k = event.key.toUpperCase();
      if (event.ctrlKey && event.shiftKey && k == 'Z') {
        this.redo();
      } else if (event.ctrlKey && k == 'Z') {
        this.undo();
      }
    });
    window.addEventListener('beforeunload', event => {
      if (!this.strictDrawing.isEmpty() || this.canUndo() || this.canRedo()) {
        (event || window.event).returnValue = 'Are you sure?';
        return 'Are you sure?';
      }
    });
  }

  drawingChangedNotByInteraction() {
    this._strictDrawingInteraction.refresh();
    this.renderPeripherals();
  }

  save() {
    saveDrawingForApp(this);
  }
}

export default App;
