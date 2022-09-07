import type { App } from 'App';

import { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import * as React from 'react';

// the underlying component
import { StrokeDasharrayField } from 'Forms/edit/svg/StrokeDasharrayField';
import { EditEvent } from 'Forms/edit/svg/StrokeDasharrayField';

import { isNullish } from 'Values/isNullish';

/**
 * A value that the stroke-dasharray attribute of an SVG element can
 * have that is a string.
 */
type StringStrokeDasharrayValue = string;

/**
 * To be remembered between mountings and unmountings.
 */
let lastNewDashedValue: StringStrokeDasharrayValue = '2 1';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The base numberings to edit.
   */
  baseNumberings: BaseNumbering[];
};

export class LineStrokeDasharrayField extends React.Component<Props> {
  get defaultDashedValue(): StringStrokeDasharrayValue {
    let defaultValue = (
      BaseNumbering.recommendedDefaults.line['stroke-dasharray']
    );

    return !isNullish(defaultValue) && !equalsNone(defaultValue) ? (
      defaultValue
    ) : (
      lastNewDashedValue
    )
  }

  handleBeforeEdit() {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let newValue = event.newValue;
    BaseNumbering.recommendedDefaults.line['stroke-dasharray'] = newValue;

    if (!equalsNone(newValue)) {
      lastNewDashedValue = newValue;
    }

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    return (
      <StrokeDasharrayField
        label='Dashed Line'
        elements={this.props.baseNumberings.map(bn => bn.line)}
        defaultDashedValue={this.defaultDashedValue}
        onBeforeEdit={() => this.handleBeforeEdit()}
        onEdit={event => this.handleEdit(event)}
        style={{
          marginTop: '10px',
          minHeight: '22px',
          alignSelf: 'start',
        }}
      />
    );
  }
}
