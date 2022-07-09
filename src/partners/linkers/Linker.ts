// a group of consecutive unpaired positions
export type Linker = {
  // the position immediately 5' to the unpaired region
  boundingPosition5: number;
  // the position immediately 3' to the unpaired region
  boundingPosition3: number;
};

export type LinkerSpecification = (
  { upstreamBoundingPosition: number, downstreamBoundingPosition: number }
);

/**
 * Allows for linker objects to be specified in different ways
 * without knowledge of the underlying object structure.
 */
export function createLinker(spec: LinkerSpecification): Linker {
  return {
    boundingPosition5: spec.upstreamBoundingPosition,
    boundingPosition3: spec.downstreamBoundingPosition,
  };
}

export function deepCopyLinker(linker: Linker): Linker {
  return { ...linker };
}

export function upstreamBoundingPosition(linker: Linker): number {
  return linker.boundingPosition5;
}

export function downstreamBoundingPosition(linker: Linker): number {
  return linker.boundingPosition3;
}

/**
 * Returns an array of the positions in the linker.
 */
export function positionsInLinker(linker: Linker): number[] {
  let ubp = upstreamBoundingPosition(linker);
  let dbp = downstreamBoundingPosition(linker);

  let ps: number[] = [];
  for (let p = ubp + 1; p < dbp; p++) {
    ps.push(p);
  }
  return ps;
}

/**
 * Returns the number of positions in the linker
 * (i.e., the number of positions between the upstream
 * and downstream bounding positions).
 */
export function numPositionsInLinker(linker: Linker): number {
  return downstreamBoundingPosition(linker) - upstreamBoundingPosition(linker) - 1;
}
