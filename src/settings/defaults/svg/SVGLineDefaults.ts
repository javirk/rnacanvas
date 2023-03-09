import * as SVG from '@svgdotjs/svg.js';

import { NonNegativeFiniteNumber } from 'Values/NonNegativeFiniteNumber';

import { SVGColor } from 'Values/svg/SVGColor';
import { SVGOpacity } from 'Values/svg/SVGOpacity';

const attributeNames = [
  'stroke',
  'stroke-width',
  'stroke-opacity',
] as const;

export type SavedSVGLineDefaults = (
  ReturnType<
    InstanceType<typeof SVGLineDefaults>['toSaved']
  >
);

/**
 * Default values for SVG line elements in the drawing of the app.
 */
export class SVGLineDefaults {
  'stroke' = new SVGColor('#000000');
  'stroke-width' = new NonNegativeFiniteNumber(1);
  'stroke-opacity' = new SVGOpacity(1);

  /**
   * Sets the values of the SVG line element to these default values.
   */
  applyTo(line: SVG.Line) {
    attributeNames.forEach(name => {
      line.attr(name, this[name].getValue());
    });
  }

  /**
   * Returns the saved form of these SVG line element defaults.
   *
   * The saved form of these SVG line element defaults can be directly
   * converted to and from JSON.
   */
  toSaved() {
    return {
      'stroke': this['stroke'].getValue(),
      'stroke-width': this['stroke-width'].getValue(),
      'stroke-opacity': this['stroke-opacity'].getValue(),
    };
  }
}
