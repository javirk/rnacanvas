import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { CreateNewDrawingForm } from 'Forms/new/CreateNewDrawingForm';
import { openNewTabOfApp } from 'Utilities/openNewTabOfApp';

export type Props = {
  app: App;
}

export function NewButton(props: Props) {
  return (
    <DroppedButton
      text='New'
      onClick={() => {
        if (props.app.strictDrawing.isEmpty()) {
          props.app.formContainer.renderForm(formProps => (
            <CreateNewDrawingForm
              app={props.app}
              close={formProps.unmount}
            />
          ));
        } else {
          openNewTabOfApp();
        }
      }}
    />
  );
}
