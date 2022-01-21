import { savableState } from './save';
import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { uuidRegex } from 'Draw/svg/assignUuid';
import { addCircleHighlighting, addCircleOutline } from 'Draw/bases/annotate/circle/add';
import { savableState as savableCircleAnnotationState } from 'Draw/bases/annotate/circle/save';
import { addNumbering } from 'Draw/bases/number/add';
import { savableState as savableNumberingState } from 'Draw/bases/number/save';

let container = null;
let drawing = null;
let base = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);

  appendSequence(drawing, { id: 'asdf', characters: 'asdfasdf' });
  base = drawing.sequences[0].bases[0];
});

afterEach(() => {
  base = null;

  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('savableState function', () => {
  it('includes class name', () => {
    let saved = savableState(base);
    expect(saved.className).toBe('Base');
  });

  it('includes text ID', () => {
    let saved = savableState(base);
    expect(saved.textId).toBe(base.text.id());
    expect(saved.textId).toMatch(uuidRegex); // check is defined
  });

  it('includes highlighting if present', () => {
    expect(base.highlighting).toBeFalsy(); // no highlighting
    let saved = savableState(base);
    expect(saved.highlighting).toBe(undefined);

    addCircleHighlighting(base);
    expect(base.highlighting).toBeTruthy();
    saved = savableState(base);
    expect(saved.highlighting).toEqual(savableCircleAnnotationState(base.highlighting));
  });

  it('includes outlines if present', () => {
    expect(base.outline).toBeFalsy(); // no outline
    let saved = savableState(base);
    expect(saved.outline).toBe(undefined);

    addCircleOutline(base);
    expect(base.outline).toBeTruthy();
    saved = savableState(base);
    expect(saved.outline).toEqual(savableCircleAnnotationState(base.outline));
  });

  it('includes numbering if present', () => {
    expect(base.numbering).toBeFalsy(); // no numbering
    let saved = savableState(base);
    expect(saved.numbering).toBe(undefined);

    addNumbering(base, 28);
    expect(base.numbering).toBeTruthy();
    saved = savableState(base);
    expect(saved.numbering).toEqual(savableNumberingState(base.numbering));
  });

  describe('converting to and from JSON', () => {
    test('without highlighting, outline or numbering', () => {
      expect(base.highlighting).toBeFalsy();
      expect(base.outline).toBeFalsy();
      expect(base.numbering).toBeFalsy();

      let saved1 = savableState(base);
      let string = JSON.stringify(saved1);
      let saved2 = JSON.parse(string);
      expect(saved2).toEqual(saved1);
    });

    test('with highlighting, outline and numbering', () => {
      addCircleHighlighting(base);
      addCircleOutline(base);
      addNumbering(base, 100);

      expect(base.highlighting).toBeTruthy();
      expect(base.outline).toBeTruthy();
      expect(base.numbering).toBeTruthy();

      let saved1 = savableState(base);
      let string = JSON.stringify(saved1);
      let saved2 = JSON.parse(string);
      expect(saved2).toEqual(saved1);
    });
  });
});
