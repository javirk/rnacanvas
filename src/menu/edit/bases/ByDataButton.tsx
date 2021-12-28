import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { BasesByData } from 'Forms/edit/bases/by/data/BasesByData';

export type Props = {
  app: App;
}

export function ByDataButton(props: Props) {
  return (
    <DroppedButton
      text='By Data (e.g., SHAPE)'
      onClick={() => {
        props.app.renderForm(formProps => (
          <BasesByData app={props.app} unmount={formProps.unmount} />
        ))
      }}
    />
  );
}
