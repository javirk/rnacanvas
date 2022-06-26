import * as SVG from '@svgdotjs/svg.js';
import { interpretNumericValue } from 'Draw/svg/interpretNumericValue';
import { direction2D as direction } from 'Math/points/direction';

/**
 * Calculates the bounding box of a line more precisely
 * than the built-in bbox method, which does not seem
 * to account for stroke-width and stroke-linecap.
 */
export function bboxOfLine(line: SVG.Line): SVG.Box {
  let bbox = line.bbox();

  let strokeWidth = interpretNumericValue(line.attr('stroke-width'))?.valueOf();

  if (strokeWidth == undefined) {
    // just return the bounding box calculated by the built-in bbox method
    return bbox;
  }

  let angle = direction({ x: bbox.width, y: bbox.height }) - (Math.PI / 2);

  return new SVG.Box(
    bbox.x - Math.abs((strokeWidth / 2) * Math.cos(angle)),
    bbox.y - Math.abs((strokeWidth / 2) * Math.sin(angle)),
    bbox.width + Math.abs(strokeWidth * Math.cos(angle)),
    bbox.height + Math.abs(strokeWidth * Math.sin(angle)),
  );
}
