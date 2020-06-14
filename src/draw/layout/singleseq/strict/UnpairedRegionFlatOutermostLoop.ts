import { FlatOutermostLoop } from './StemLayout';
import UnpairdRegion from './UnpairedRegion';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './PerBaseStrictLayoutProps';
import NormalizedBaseCoordinates from '../../NormalizedBaseCoordinates';

function baseCoordinatesFlatOutermostLoop(
  ur: UnpairdRegion,
  generalProps: GeneralStrictLayoutProps,
  perBaseProps: PerBaseStrictLayoutProps[],
): NormalizedBaseCoordinates[] {
  return FlatOutermostLoop.traverseUnpairedRegion53(ur, generalProps, perBaseProps);
}

export default baseCoordinatesFlatOutermostLoop;
