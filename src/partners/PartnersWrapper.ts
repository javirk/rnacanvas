import type { Partners } from 'Partners/Partners';
import { partnerOf } from 'Partners/Partners';

import { pair } from 'Partners/edit';
import { unpair } from 'Partners/edit';

export class PartnersWrapper {
  /**
   * The wrapped partners.
   */
  readonly partners: Partners;

  constructor(partners: Partners | PartnersWrapper) {
    this.partners = partners instanceof PartnersWrapper ? partners.partners : partners;
  }

  partnerOf(p: number) {
    return partnerOf(this.partners, p);
  }

  get length() {
    return this.partners.length;
  }

  pair(p: number, q: number) {
    pair(this.partners, p, q);
  }

  unpair(p: number) {
    unpair(this.partners, p);
  }
}

export {
  PartnersWrapper as Partners,
};
