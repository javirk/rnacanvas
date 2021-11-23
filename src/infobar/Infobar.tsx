import * as React from 'react';
import styles from './Infobar.css';
import { AppInterface as App } from 'AppInterface';
import { ZoomControl } from './zoom/ZoomControl';

export type Props = {
  app: App;
}

export function Infobar(props: Props) {
  return props.app.strictDrawing.isEmpty() ? null : (
    <div className={styles.infobar} >
      <div className={styles.spacer} />
      <ZoomControl app={props.app} />
    </div>
  );
}
