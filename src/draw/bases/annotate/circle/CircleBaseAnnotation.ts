import {
  CircleBaseAnnotationInterface,
  Repositioning,
} from './CircleBaseAnnotationInterface';
import * as SVG from '@svgdotjs/svg.js';
import { Point2D as Point } from 'Math/points/Point';
import { assignUuid } from 'Draw/svg/assignUuid';
import { Values } from './values';

export class CircleBaseAnnotation implements CircleBaseAnnotationInterface {
  static recommendedDefaults: Values = {
    circle: {
      'r': 7,
      'stroke': '#00ffff',
      'stroke-width': 1,
      'stroke-opacity': 1,
      'fill': '#c3ffff',
      'fill-opacity': 1,
    },
  };

  readonly circle: SVG.Circle;

  _baseCenter: Point;

  constructor(circle: SVG.Circle, baseCenter: Point) {
    if (circle.type != 'circle') {
      throw new Error("Element isn't a circle.");
    }

    this.circle = circle;

    // use the attr method to check if an ID is initialized
    // since the id method itself will initialize an ID (to
    // a non-UUID)
    if (!this.circle.attr('id')) {
      assignUuid(this.circle);
    }

    this._baseCenter = { ...baseCenter };
  }

  get id(): string {
    return String(this.circle.id());
  }

  contains(node: SVG.Element | Node): boolean {
    if (node instanceof SVG.Element) {
      node = node.node;
    }
    return this.circle.node == node || this.circle.node.contains(node);
  }

  reposition(rp?: Repositioning) {
    this.circle.attr({
      'cx': rp?.baseCenter?.x ?? this._baseCenter.x,
      'cy': rp?.baseCenter?.y ?? this._baseCenter.y,
    });
    if (rp?.baseCenter) {
      this._baseCenter = { ...rp.baseCenter };
    }
  }
}
