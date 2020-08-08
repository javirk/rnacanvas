import { BaseInterface as Base } from '../../BaseInterface';

export interface HighlightingProps {
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  fill?: string;
  fillOpacity?: number;
}

export function highlightBase(b: Base, props?: HighlightingProps) {
  if (!b) {
    console.error('No base provided.');
    return;
  }
  if (!props) {
    props = {};
  }
  let h = b.addCircleHighlighting();
  h.radius = props.radius ?? 1.1 * b.fontSize;
  h.stroke = props.stroke ?? '#000000';
  h.strokeWidth = props.strokeWidth ?? 0;
  h.strokeOpacity = props.strokeOpacity ?? 1;
  h.fill = props.fill ?? '#ffd700';
  h.fillOpacity = props.fillOpacity ?? 0.5;
}

export default highlightBase;
