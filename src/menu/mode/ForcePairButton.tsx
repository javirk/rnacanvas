import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { DroppedButton } from 'Menu/DroppedButton';

function forcePairing(app: App): boolean {
  let interaction = app.strictDrawingInteraction;
  let mode = interaction.foldingMode;
  return interaction.folding() && mode.forcePairing();
}

export type Props = {
  app: App;
}

export function ForcePairButton(props: Props) {
  return (
    <DroppedButton
      text='Force Pair'
      onClick={() => {
        if (!forcePairing(props.app)) {
          props.app.strictDrawingInteraction.startFolding();
          props.app.strictDrawingInteraction.foldingMode.forcePair();
        }
      }}
      disabled={forcePairing(props.app)}
      checked={forcePairing(props.app)}
    />
  );
}
