import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import { defaultStrungRectangleValues } from 'Draw/bonds/strung/defaults';

import { repositionStrungElementAtIndex } from 'Forms/edit/bonds/strung/repositionStrungElementAtIndex';

import * as React from 'react';

import { NumberPropertyInput } from 'Forms/edit/objects/NumberPropertyInput';
import { EditEvent } from 'Forms/edit/objects/NumberPropertyInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

const defaultValues = {
  'StrungRectangle': defaultStrungRectangleValues,
};

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: StrungRectangle[];

  /**
   * The bonds possessing the strung elements.
   */
  bonds: Bond[];

  /**
   * The index that the strung elements are at in the strung elements
   * arrays of the bonds possessing the strung elements.
   */
  strungElementsIndex: number;
};

export class BorderRadiusField extends React.Component<Props> {
  onBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  onEdit(event: EditEvent) {
    this.props.bonds.forEach(bond => {
      repositionStrungElementAtIndex({
        bond,
        index: this.props.strungElementsIndex,
      });
    });

    let newValue = event.newValue;
    let strungElements = this.props.strungElements;
    let types = new Set(strungElements.map(ele => ele.type));
    types.forEach(t => {
      defaultValues[t]['borderRadius'] = newValue;
    });

    this.props.app.refresh();
  }

  render() {
    return (
      <FieldLabel>
        <NumberPropertyInput
          objects={this.props.strungElements}
          propertyName='borderRadius'
          minValue={0}
          places={2}
          onBeforeEdit={this.onBeforeEdit}
          onEdit={this.onEdit}
        />
        <span style={{ marginLeft: '8px' }} >
          Border Radius
        </span>
      </FieldLabel>
    );
  }
}
