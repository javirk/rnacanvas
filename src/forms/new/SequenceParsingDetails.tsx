import * as React from 'react';
import styles from './ParsingDetails.css';
import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';

interface Props {
  ignoringNumbers: boolean;
  ignoreNumbers: (b: boolean) => void;
  ignoringNonAugctLetters: boolean;
  ignoreNonAugctLetters: (b: boolean) => void;
  ignoringNonAlphanumerics: boolean;
  ignoreNonAlphanumerics: (b: boolean) => void;
}

export function IgnoreNumbersCheckbox(props: Props): React.ReactElement {
  return (
    <CheckboxField
      label='Ignore Numbers'
      checked={props.ignoringNumbers}
      onChange={event => props.ignoreNumbers(event.target.checked)}
      style={{ alignSelf: 'start' }}
    />
  );
}

export function IgnoreNonAugctLettersCheckbox(props: Props): React.ReactElement {
  return (
    <CheckboxField
      label='Ignore Non-AUGCT Letters'
      checked={props.ignoringNonAugctLetters}
      onChange={event => props.ignoreNonAugctLetters(event.target.checked)}
      style={{ alignSelf: 'start' }}
    />
  );
}

export function IgnoreNonAlphanumericsCheckbox(props: Props): React.ReactElement {
  return (
    <CheckboxField
      label='Ignore Non-Alphanumerics'
      checked={props.ignoringNonAlphanumerics}
      onChange={event => props.ignoreNonAlphanumerics(event.target.checked)}
      style={{ alignSelf: 'start' }}
    />
  );
}

export function SequenceParsingDetails(props: Props): React.ReactElement {
  return (
    <div className={styles.parsingDetails} style={{ width: '360px', margin: '24px 0px 0px 12px' }} >
      <h3 className={styles.header} >
        Sequence Parsing Details
      </h3>
      <div style={{ marginLeft: '8px' }} >
        <div style={{ height: '6px' }} />
        <p>
          All letters, numbers, and non-alphanumeric characters are read in as individual bases, unless specified to be ignored.
        </p>
        <div style={{ margin: '8px 0 0 8px', display: 'flex', flexDirection: 'column' }} >
          <IgnoreNumbersCheckbox {...props} />
          <div style={{ marginTop: '8px' }} >
            <IgnoreNonAugctLettersCheckbox {...props} />
          </div>
          <div style={{ marginTop: '8px' }} >
            <IgnoreNonAlphanumericsCheckbox {...props} />
          </div>
        </div>
        <div style={{ height: '8px' }} />
        <p>
          All whitespace is ignored.
        </p>
      </div>
    </div>
  );
}
