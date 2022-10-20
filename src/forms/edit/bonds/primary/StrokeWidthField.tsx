import type { App } from 'App';

import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import * as React from 'react';

import { NumericAttributeInput } from 'Forms/edit/svg/NumericAttributeInput';
import type { EditEvent } from 'Forms/edit/svg/NumericAttributeInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

// should be stable across mountings and unmountings
// (to facilitate refocusing when the app is refreshed)
const inputId = generateHTMLCompatibleUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The primary bonds to edit.
   */
  primaryBonds: PrimaryBond[];
}

export class StrokeWidthField extends React.Component<Props> {
  handleBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;

    // don't make primary bonds too hard to see by default
    if (newValue >= 0.5) {
      PrimaryBond.recommendedDefaults.line['stroke-width'] = newValue;
    }

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    let style: React.CSSProperties = {
      marginTop: '10px',
      alignSelf: 'start',
      cursor: 'text',
    };

    return (
      <FieldLabel style={style} >
        <NumericAttributeInput
          id={inputId}
          elements={this.props.primaryBonds.map(pb => pb.line)}
          attributeName='stroke-width'
          minValue={0}
          places={2}
          onBeforeEdit={event => this.handleBeforeEdit(event)}
          onEdit={event => this.handleEdit(event)}
          style={{ minWidth: '39px' }}
        />
        <span style={{ paddingLeft: '8px' }} >
          Line Width
        </span>
      </FieldLabel>
    );
  }
}
