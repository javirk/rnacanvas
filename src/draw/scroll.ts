import type { Drawing } from 'Draw/Drawing';

import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

export class DrawingWrapper {
  readonly wrappedDrawing: Drawing | StrictDrawing;

  constructor(drawing: Drawing | StrictDrawing) {
    this.wrappedDrawing = drawing;
  }

  get scrollLeft() {
    return this.wrappedDrawing.svgContainer.scrollLeft;
  }

  set scrollLeft(scrollLeft) {
    this.wrappedDrawing.svgContainer.scrollLeft = scrollLeft;
  }
}
