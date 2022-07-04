import type { App } from 'App';

import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { NumberingIncrementInput } from 'Forms/edit/sequences/NumberingIncrementInput';

export type Props = {
  app: App; // a reference to the whole app
};

export function NumberingIncrementField(props: Props) {
  return (
    <FieldLabel
      style={{
        margin: '10px 8px 0 0', alignSelf: 'start',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        cursor: 'text',
      }}
    >
      <NumberingIncrementInput
        app={props.app}
        sequence={props.app.strictDrawing.layoutSequence()}
      />
      <span style={{ marginLeft: '8px' }} >
        Increment
      </span>
    </FieldLabel>
  );
}
