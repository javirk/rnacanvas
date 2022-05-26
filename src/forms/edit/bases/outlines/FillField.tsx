import type { App } from 'App';
import type { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { FillPicker } from './FillPicker';
import { FillOpacityInput } from './FillOpacityInput';

export type Props = {
  app: App; // a reference to the whole app

  outlines: CircleBaseAnnotation[]; // the base outlines to edit
};

export function FillField(props: Props) {
  return (
    <div
      style={{
        marginTop: '8px', alignSelf: 'start',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
      }}
    >
      <FillPicker {...props} />
      <div style={{ width: '10px' }} />
      <FieldLabel style={{ cursor: 'text' }} >
        <FillOpacityInput {...props} />
        <span style={{ marginLeft: '8px' }} >
          Fill
        </span>
      </FieldLabel>
    </div>
  );
}
