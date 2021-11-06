import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { DroppedButton } from '../DroppedButton';
import { EditSecondaryBonds } from 'Forms/edit/bonds/secondary/EditSecondaryBonds';

interface Props {
  app: App;
}

export function EditSecondaryBondsButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text='Secondary Bonds'
      onClick={() => {
        props.app.renderForm(close => (
          <EditSecondaryBonds
            app={props.app}
            secondaryBonds={[...props.app.strictDrawing.drawing.secondaryBonds]}
            unmount={close}
          />
        ))
      }}
    />
  );
}
