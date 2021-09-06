import {
  DrawingInterface,
  DrawingSavableState,
} from './DrawingInterface';
import * as Svg from '@svgdotjs/svg.js';
import { Sequence } from 'Draw/sequences/Sequence';
import { appendSequence } from 'Draw/sequences/add/sequence';
import {
  SavableState as SavableSequenceState,
  savableState as savableSequenceState,
} from 'Draw/sequences/save';
import { appendSavedSequence } from 'Draw/sequences/saved';
import { Base } from 'Draw/bases/Base';
import { orientBaseNumberings } from 'Draw/bases/number/orient';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import {
  SavableState as SavableStraightBondState,
  savableState as savableStraightBondState,
} from 'Draw/bonds/straight/save';
import { addSavedPrimaryBonds, addSavedSecondaryBonds } from 'Draw/bonds/straight/saved';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import {
  SavableState as SavableTertiaryBondState,
  savableState as savableTertiaryBondState,
} from 'Draw/bonds/curved/save';
import { addSavedTertiaryBonds } from 'Draw/bonds/curved/saved';

interface Coordinates {
  x: number;
  y: number;
}

export interface BasesByIds {
  [id: string]: Base | undefined;
}

export class Drawing implements DrawingInterface {
  _div!: HTMLElement;
  svg!: Svg.Svg;

  sequences: Sequence[];
  primaryBonds: PrimaryBond[];
  secondaryBonds: SecondaryBond[];
  tertiaryBonds: TertiaryBond[];

  constructor() {
    this.sequences = [];
    this.primaryBonds = [];
    this.secondaryBonds = [];
    this.tertiaryBonds = [];
  }

  addTo(container: Node, SVG: () => Svg.Svg) {
    this._div = document.createElement('div');
    this._div.style.cssText = 'width: 100%; height: 100%; overflow: auto;';
    container.appendChild(this._div);
    this.svg = SVG().addTo(this._div);
    this.svg.attr({
      'width': 2 * window.screen.width,
      'height': 2 * window.screen.height,
    });
  }

  centerOfView(): Coordinates {
    return {
      x: this._div.scrollLeft + (window.innerWidth / 2),
      y: this._div.scrollTop + (window.innerHeight / 2),
    };
  }

  centerViewOn(cs: Coordinates) {
    let sl = cs.x - (window.innerWidth / 2);
    sl = Number.isFinite(sl) ? sl : 0;
    let st = cs.y - (window.innerHeight / 2);
    st = Number.isFinite(st) ? st : 0;
    this._div.scrollLeft = sl;
    this._div.scrollTop = st;
  }

  centerView() {
    this.centerViewOn({
      x: this._div.scrollWidth / 2,
      y: this._div.scrollHeight / 2,
    });
  }

  get scrollLeft(): number {
    return this._div.scrollLeft;
  }

  set scrollLeft(sl) {
    this._div.scrollLeft = sl;
  }

  get scrollWidth(): number {
    return this._div.scrollWidth;
  }

  get scrollTop(): number {
    return this._div.scrollTop;
  }

  set scrollTop(st) {
    this._div.scrollTop = st;
  }

  get scrollHeight(): number {
    return this._div.scrollHeight;
  }

  get width(): number {
    return this.svg.viewbox().width;
  }

  get height(): number {
    return this.svg.viewbox().height;
  }

  setWidthAndHeight(width: number, height: number) {
    if (width < 0 || height < 0) {
      return;
    }
    let z = this.zoom;
    this.svg.viewbox(0, 0, width, height);
    this.svg.attr({
      'width': z * width,
      'height': z * height,
    });
  }

  get zoom(): number {
    let vb = this.svg.viewbox();
    if (vb.width == 0) {
      return 1;
    }
    return this.svg.attr('width') / vb.width;
  }

  set zoom(z: number) {
    if (z <= 0) {
      return;
    }
    let vb = this.svg.viewbox();
    let w = z * vb.width;
    let h = z * vb.height;
    let cv = this.centerOfView();
    cv.x *= z / this.zoom;
    cv.y *= z / this.zoom;
    this.svg.attr({ 'width': w, 'height': h });
    this.centerViewOn(cv);
  }

  isEmpty(): boolean {
    return this.numSequences == 0;
  }

  get numSequences(): number {
    return this.sequences.length;
  }

  getSequenceById(id: string): (Sequence | undefined) {
    return this.sequences.find(seq => seq.id === id);
  }

  getSequenceAtIndex(i: number): (Sequence | undefined) {
    return this.sequences[i];
  }

  forEachSequence(f: (seq: Sequence) => void) {
    this.sequences.forEach(seq => f(seq));
  }

  sequenceIds(): string[] {
    let ids = [] as string[];
    this.sequences.forEach(seq => ids.push(seq.id));
    return ids;
  }

  sequenceIdIsTaken(id: string): boolean {
    return this.sequenceIds().includes(id);
  }

  get overallCharacters(): string {
    let cs = '';
    this.forEachSequence(seq => {
      cs += seq.characters;
    });
    return cs;
  }

  /**
   * Returns null if the given sequence ID is taken.
   */
  appendSequence(id: string, characters: string): (Sequence | null) {
    if (this.sequenceIdIsTaken(id)) {
      return null;
    }
    return appendSequence(this, { id: id, characters: characters });
  }

  get numBases(): number {
    let n = 0;
    this.forEachSequence(seq => {
      n += seq.length;
    });
    return n;
  }

  getBaseById(id: string): (Base | null) {
    let base = null;
    this.forEachBase((b: Base) => {
      if (b.id === id) {
        base = b;
      }
    });
    return base;
  }

  getBaseAtOverallPosition(p: number): (Base | undefined) {
    let seqStart = 1;
    for (let s = 0; s < this.numSequences; s++) {
      let seq = this.sequences[s];
      let seqEnd = seqStart + seq.length - 1;
      if (p >= seqStart && p <= seqEnd) {
        return seq.getBaseAtPosition(p - seqStart + 1);
      }
      seqStart = seqEnd + 1;
    }
    return undefined;
  }

  /**
   * Returns zero if the given base is not in this drawing.
   */
  overallPositionOfBase(b: Base): number {
    let p = 0;
    this.forEachBase((base: Base, q: number) => {
      if (base.id === b.id) {
        p = q;
      }
    });
    return p;
  }

  forEachBase(f: (b: Base, p: number) => void) {
    let p = 1;
    this.forEachSequence(seq => {
      seq.bases.forEach(b => {
        f(b, p);
        p++;
      });
    });
  }

  bases(): Base[] {
    let bs: Base[] = [];
    this.forEachBase(b => bs.push(b));
    return bs;
  }

  baseIds(): string[] {
    let ids = [] as string[];
    this.forEachBase((b: Base) => ids.push(b.id));
    return ids;
  }

  basesByIds(): BasesByIds {
    let map = {} as BasesByIds;
    this.forEachBase(b => map[b.id] = b);
    return map;
  }

  sequenceOfBase(b: Base): (Sequence | undefined) {
    return this.sequences.find(seq => seq.bases.includes(b));
  }

  createBases(characters: string): Base[] {
    let bs = [] as Base[];
    let x = 0;
    characters.split('').forEach(c => {
      bs.push(Base.create(this.svg, c, x, 0));
      x += 10;
    });
    return bs;
  }

  repositionBonds() {
    this.primaryBonds.forEach(pb => pb.reposition());
    this.secondaryBonds.forEach(sb => sb.reposition());
    this.tertiaryBonds.forEach(tb => tb.reposition());
  }

  clear() {
    this.sequences = [];
    this.primaryBonds = [];
    this.secondaryBonds = [];
    this.tertiaryBonds = [];
    this.svg.clear();
  }

  get svgString(): string {
    return this.svg.svg();
  }

  savableState(): DrawingSavableState {
    let sequences = [] as SavableSequenceState[];
    this.forEachSequence(seq => sequences.push(savableSequenceState(seq)));
    let primaryBonds = [] as SavableStraightBondState[];
    this.primaryBonds.forEach(pb => primaryBonds.push(savableStraightBondState(pb)));
    let secondaryBonds = [] as SavableStraightBondState[];
    this.secondaryBonds.forEach(sb => secondaryBonds.push(savableStraightBondState(sb)));
    let tertiaryBonds = [] as SavableTertiaryBondState[];
    this.tertiaryBonds.forEach(tb => tertiaryBonds.push(savableTertiaryBondState(tb)));
    return {
      className: 'Drawing',
      svg: this.svg.svg(),
      sequences: sequences,
      primaryBonds: primaryBonds,
      secondaryBonds: secondaryBonds,
      tertiaryBonds: tertiaryBonds,
    };
  }

  /**
   * If the saved state cannot be successfully applied, the state
   * of the drawing will not be changed.
   *
   * Returns true if the saved state was successfully applied.
   */
  applySavedState(savedState: DrawingSavableState): boolean {
    let prevState = this.savableState();
    try {
      this._applySavedState(savedState);
      return true;
    } catch (err) {
      console.error(err.toString());
      console.error('Unable to apply saved state.');
    }
    console.log('Reapplying previous state...');
    this._applySavedState(prevState);
    console.log('Reapplied previous state.');
    return false;
  }

  _applySavedState(savedState: DrawingSavableState): (void | never) {
    if (savedState.className !== 'Drawing') {
      throw new Error('Wrong class name.');
    }
    let wasEmpty = this.isEmpty();
    this.clear();
    this._applySavedSvg(savedState);
    this._appendSavedSequences(savedState);
    this._addSavedPrimaryBonds(savedState);
    this._addSavedSecondaryBonds(savedState);
    this._addSavedTertiaryBonds(savedState);
    orientBaseNumberings(this);
    if (wasEmpty) {
      this.centerView();
    }
  }

  _applySavedSvg(savedState: DrawingSavableState): (void | never) {
    this.svg.clear();
    this.svg.svg(savedState.svg);
    let nested = this.svg.first() as Svg.Svg;
    let vb = nested.viewbox();
    let w = vb.width;
    let h = vb.height;
    let content = nested.svg(false);
    this.svg.clear();
    this.svg.svg(content);
    this.setWidthAndHeight(w, h);
  }

  _appendSavedSequences(savedState: DrawingSavableState): (void | never) {
    savedState.sequences.forEach(saved => {
      appendSavedSequence(this, saved);
    });
  }

  _addSavedPrimaryBonds(savedState: DrawingSavableState): (void | never) {
    addSavedPrimaryBonds(this, savedState.primaryBonds);
  }

  _addSavedSecondaryBonds(savedState: DrawingSavableState): (void | never) {
    addSavedSecondaryBonds(this, savedState.secondaryBonds);
  }

  _addSavedTertiaryBonds(savedState: DrawingSavableState): (void | never) {
    addSavedTertiaryBonds(this, savedState.tertiaryBonds);
  }
}

export default Drawing;
