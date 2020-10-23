import { FlippingModeInterface as FlippingMode } from './FlippingModeInterface';
import { positionsOfStem, Stem } from '../highlight/positionsOfStem';
import { highlightBase } from '../highlight/highlightBase';

export function highlightStem(mode: FlippingMode, st: Stem) {
  let drawing = mode.strictDrawing.drawing;
  let bHovered = typeof mode.hovered == 'number' ? drawing.getBaseAtOverallPosition(mode.hovered) : undefined;
  positionsOfStem(st).forEach(p => {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      let radius = 0.85 * b.fontSize;
      if (b.outline) {
        radius = Math.max(radius, 1.15 * (b.outline.radius + b.outline.strokeWidth));
      }
      let h = highlightBase(b, {
        radius: radius,
        fill: 'none',
        stroke: '#00bfff',
        strokeWidth: 1.5,
        strokeOpacity: 0.85,
      });
      h.pulsateBetween({
        radius: 1.5 * radius,
        strokeOpacity: 0.425,
      }, { duration: 1000 });
      if (bHovered && b.distanceBetweenCenters(bHovered) < 5 * radius) {
        h.back();
      }
    }
  });
}
