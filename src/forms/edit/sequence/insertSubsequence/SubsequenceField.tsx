import * as React from 'react';
import styles from './SubsequenceField.css';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { FieldDescription } from 'Forms/inputs/labels/FieldDescription';

export type Props = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
};

export function SubsequenceField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <FieldLabel style={{ display: 'flex', flexDirection: 'column' }} >
        Subsequence
        <textarea
          className={styles.subsequenceTextArea}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          rows={10}
        />
      </FieldLabel>
      <FieldDescription style={{ margin: '6px 0 0 16px' }} >
        ...an RNA or DNA subsequence "CUGCCA"
      </FieldDescription>
    </div>
  );
}
