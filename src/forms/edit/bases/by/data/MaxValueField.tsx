import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

export type Props = {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onEnterKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function MaxValueField(props: Props) {
  return (
    <TextInputField
      label='Maximum Value'
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onKeyUp={event => {
        if (event.key.toLowerCase() == 'enter' && props.onEnterKeyUp) {
          props.onEnterKeyUp(event);
        }
      }}
      input={{ style: { minWidth: '7ch' } }}
      style={{ margin: '8px 0 0 10px', alignSelf: 'start' }}
    />
  );
}
