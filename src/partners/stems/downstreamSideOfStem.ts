import { Stem } from 'Partners/stems/Stem';
import { pairs as pairsOfStem } from 'Partners/stems/Stem';
import { downstreamPartner } from 'Partners/pairs/Pair';

/**
 * Returns the positions in the downstream side of the stem.
 */
export function downstreamSideOfStem(stem: Stem): number[] {
  return pairsOfStem(stem).map(pair => downstreamPartner(pair));
}