import { StrictDrawingInterface as StrictDrawing } from '../../../draw/StrictDrawingInterface';
import { DrawingInterface as Drawing } from '../../../draw/DrawingInterface';
import { SequenceInterface as Sequence } from '../../../draw/SequenceInterface';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { stemOfPosition } from '../../../parse/stemOfPosition';
import { PerBaseStrictLayoutProps as PerBaseProps } from '../../../draw/layout/singleseq/strict/PerBaseStrictLayoutProps';
import { copyStemProps, resetStemProps } from '../../../draw/layout/singleseq/strict/stemProps';
import {
  PrimaryBondInterface as PrimaryBond,
  SecondaryBondInterface as SecondaryBond,
} from '../../../draw/StraightBondInterface';
import { TertiaryBondInterface as TertiaryBond } from '../../../draw/QuadraticBezierBondInterface';

interface Range {
  start: number;
  end: number;
}

/**
 * Returns a message as a string explaining why cannot remove if cannot remove.
 */
export function cannotRemove(strictDrawing: StrictDrawing, inputs: Range): string | undefined {
  let drawing = strictDrawing.drawing;
  if (drawing.numSequences == 0) {
    return 'Drawing has no sequences.';
  } else if (drawing.numSequences > 1) {
    return 'Drawing has multiple sequences.';
  }
  let seq = drawing.getSequenceAtIndex(0);
  if (seq) {
    let r = reversePositionOffsets(seq, inputs);
    if (r.start > r.end) {
      return 'Start cannot be greater than end.';
    } else if (seq.positionOutOfRange(r.start)) {
      return 'Start is out of range.';
    } else if (seq.positionOutOfRange(r.end)) {
      return 'End is out of range.';
    } else if (r.start == 1 && r.end == seq.length) {
      return 'Cannot remove entire sequence.';
    }
  }
}

function reversePositionOffsets(seq: Sequence, r: Range): Range {
  return {
    start: seq.reversePositionOffset(r.start),
    end: seq.reversePositionOffset(r.end),
  };
}

function transferStemProps(strictDrawing: StrictDrawing, r: Range) {
  let partners = strictDrawing.layoutPartners();
  let st = stemOfPosition(r.end + 1, partners);
  if (st) {
    let perBaseProps = strictDrawing.perBaseLayoutProps();
    let fromProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, st.position5);
    let toProps = PerBaseProps.getOrCreatePropsAtPosition(perBaseProps, r.end + 1);
    copyStemProps(fromProps, toProps);
    let wasFlipped = fromProps.flipStem;
    resetStemProps(fromProps);
    if (wasFlipped && st.position5 < r.start) {
      fromProps.flipStem = true;
      toProps.flipStem = false;
    }
    strictDrawing.setPerBaseLayoutProps(perBaseProps);
  }
}

function removePerBaseProps(strictDrawing: StrictDrawing, r: Range) {
  let perBaseProps = strictDrawing.perBaseLayoutProps();
  perBaseProps.splice(r.start - 1, r.end - r.start + 1);
  strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

function removeBondsWithBases(drawing: Drawing, bs: Base[]) {
  let baseIds = new Set<string>();
  bs.forEach(b => baseIds.add(b.id));
  let bonds = [] as (PrimaryBond | SecondaryBond | TertiaryBond)[];
  drawing.forEachPrimaryBond(pb => bonds.push(pb));
  drawing.forEachSecondaryBond(sb => bonds.push(sb));
  drawing.forEachTertiaryBond(tb => bonds.push(tb));
  let toRemove = [] as string[];
  bonds.forEach(bd => {
    if (baseIds.has(bd.base1.id) || baseIds.has(bd.base2.id)) {
      toRemove.push(bd.id);
    }
  });
  toRemove.forEach(id => {
    drawing.removePrimaryBondById(id);
    drawing.removeSecondaryBondById(id);
    drawing.removeTertiaryBondById(id);
  });
}

function repairStrandBreak(drawing: Drawing, seq: Sequence, removedRange: Range) {
  let b1 = seq.getBaseAtPosition(removedRange.start - 1);
  let b2 = seq.getBaseAtPosition(removedRange.start);
  if (b1 && b2) {
    drawing.addPrimaryBond(b1, b2);
  }
}

export function remove(strictDrawing: StrictDrawing, inputs: Range) {
  if (!cannotRemove(strictDrawing, inputs)) {
    let drawing = strictDrawing.drawing;
    let seq = drawing.getSequenceAtIndex(0);
    if (seq) {
      let r = reversePositionOffsets(seq, inputs);
      transferStemProps(strictDrawing, r);
      removePerBaseProps(strictDrawing, r);
      removeBondsWithBases(drawing, seq.getBasesInRange(r.start, r.end));
      seq.removeBasesInRange(r.start, r.end);
      repairStrandBreak(drawing, seq, r);
      strictDrawing.applyLayout();
    }
  }
}
