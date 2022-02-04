import { CircleBaseAnnotationInterface } from './CircleBaseAnnotationInterface';
import { CircleBaseAnnotation } from './CircleBaseAnnotation';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';
import { findCircleByUniqueId } from 'Draw/saved/svg';

export type SavableState = {
  className: 'CircleBaseAnnotation';
  circleId: string;
}

export function savableState(cba: CircleBaseAnnotationInterface): SavableState {
  return {
    className: 'CircleBaseAnnotation',
    circleId: String(cba.circle.id()),
  };
}

export type SavedState = { [key: string]: unknown }

function fromSaved(b: Base, saved: SavedState): CircleBaseAnnotation | never {
  if (saved.className != 'CircleBaseAnnotation') {
    throw new Error("Saved state isn't for a circle base annotation.");
  }
  let svg = b.text.root();
  if (!(svg instanceof SVG.Svg)) {
    throw new Error('Unable to retrieve root SVG element of base.');
  } else {
    let c = findCircleByUniqueId(svg, saved.circleId);
    let baseCenter = { x: b.xCenter, y: b.yCenter };
    return new CircleBaseAnnotation(c, baseCenter);
  }
}

export function addSavedCircleOutline(b: Base, saved: SavedState): void | never {
  let cba = fromSaved(b, saved);
  if (b.outline) {
    throw new Error('Base already has an outline.');
  }
  b.outline = cba;
}

export function addSavedCircleHighlighting(b: Base, saved: SavedState): void | never {
  let cba = fromSaved(b, saved);
  if (b.highlighting) {
    throw new Error('Base already has highlighting.');
  }
  b.highlighting = cba;
}
