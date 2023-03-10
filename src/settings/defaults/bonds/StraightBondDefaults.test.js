import { StraightBond } from 'Draw/bonds/straight/StraightBond';

import { Base } from 'Draw/bases/Base';

import * as SVG from 'Draw/svg/NodeSVG';

import { StraightBondDefaults } from './StraightBondDefaults';

let svg = null;

let straightBond = null;

let defaults = null;

beforeEach(() => {
  svg = SVG.SVG();
  svg.addTo(document.body);
});

/**
 * Create a straight bond.
 */
beforeEach(() => {
  let base1 = new Base({ text: svg.text('A') });
  let base2 = new Base({ text: svg.text('U') });

  base1.recenter({ x: 50, y: 100 });
  base2.recenter({ x: 20, y: 150 });

  let line = svg.line(50, 100, 20, 150);

  straightBond = new StraightBond(line, base1, base2);
});

beforeEach(() => {
  defaults = new StraightBondDefaults();
});

afterEach(() => {
  defaults = null;

  straightBond = null;

  svg.remove();
  svg = null;
});

describe('StraightBondDefaults class', () => {
  describe('applyTo method', () => {
    it('applies line attributes', () => {
      // just test some line attributes
      defaults.line['stroke'].setValue('#ae4801');
      defaults.line['stroke-width'].setValue(6.1802);

      defaults.applyTo(straightBond);

      expect(straightBond.line.attr('stroke')).toBe('#ae4801');
      expect(straightBond.line.attr('stroke-width')).toBe(6.1802);
    });

    it('applies properties', () => {
      defaults.basePadding1.setValue(4.0921);
      defaults.basePadding2.setValue(8.4903);

      defaults.applyTo(straightBond);

      expect(straightBond.basePadding1).toBeCloseTo(4.0921);
      expect(straightBond.basePadding2).toBeCloseTo(8.4903);
    });
  });
});
