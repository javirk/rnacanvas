import type { App } from 'App';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

import { round } from 'Math/round';
import { isBlank } from 'Parse/isBlank';

export type Props = {
  app: App; // a reference to the whole app
}

type State = {
  value: string;
}

function constrainTerminiGap(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  } else if (value < 0) {
    return 0;
  } else {
    return value;
  }
}

export class TerminiGapField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let generalLayoutProps = props.app.strictDrawing.generalLayoutProps;
    let terminiGap = generalLayoutProps.terminiGap;
    terminiGap = round(terminiGap, 2);

    this.state = {
      value: terminiGap.toString(),
    };
  }

  render() {
    return (
      <TextInputField
        label='Termini Gap'
        value={this.state.value}
        onChange={event => this.setState({ value: event.target.value })}
        onBlur={() => {
          this.submit();
          this.props.app.refresh();
        }}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            this.submit();
            this.props.app.refresh();
          }
        }}
        input={{
          style: { width: '6ch' },
        }}
        style={{ alignSelf: 'start' }}
      />
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let value = Number.parseFloat(this.state.value);
    if (!Number.isFinite(value)) {
      return;
    }

    let strictDrawing = this.props.app.strictDrawing;
    if (value == strictDrawing.generalLayoutProps.terminiGap) {
      return;
    }

    this.props.app.pushUndo();

    // set termini gap
    value = constrainTerminiGap(value);
    value = round(value, 2);
    strictDrawing.generalLayoutProps.terminiGap = value;
    strictDrawing.updateLayout();
  }
}
