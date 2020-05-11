import React from 'react';
import PropTypes from 'prop-types';
const uuidv1 = require('uuid/v1');

class OpenRna2drawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      attemptedFileLoad: false,
      fileContents: null,
      
      errorMessage: '',
      errorMessageKey: uuidv1(),
    };
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width,
          height: '100%',
          backgroundColor: '#fefefe',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {this.boundingDivs()}
      </div>
    );
  }

  boundingDivs() {
    return (
      <div
        style={{
          flexGrow: '1',
          maxHeight: '824px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            flexGrow: '1',
            maxWidth: '1200px',
            margin: '12px',
            border: 'thin solid #bfbfbf',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {this.titleAndContent()}
        </div>
      </div>
    );
  }

  titleAndContent() {
    return (
      <div
        style={{
          flexGrow: '1',
          margin: '32px 80px 32px 80px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this.title()}
        {this.content()}
      </div>
    );
  }

  title() {
    return (
      <div>
        <p className={'unselectable-text'} style={{ margin: '0px 24px 0px 24px', fontSize: '24px' }} >
          Open an RNA2Drawer 2 File
        </p>
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px thin 0px',
            borderStyle: 'solid',
            borderColor: '#bfbfbf',
            margin: '8px 0px 0px 0px',
          }}
        ></div>
      </div>
    );
  }

  content() {
    return (
      <div
        style={{
          flexGrow: '1',
          margin: '32px 40px 0px 40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this.fileUpload()}
        {this.errorSection()}
        {this.submitSection()}
      </div>
    );
  }

  fileUpload() {
    return (
      <div style={{ margin: '0px 0px 26px 0px' }} >
        <input
          type={'file'}
          onChange={event => this.onFileInputChange(event)}
        />
      </div>
    );
  }

  onFileInputChange(event) {
    if (event.target.files.length > 0) {
      this.setState({
        attemptedFileLoad: true,
        errorMessage: '',
        errorMessageKey: uuidv1(),
      });
      let fr = new FileReader();
      fr.addEventListener('load', () => {
        this.setState({
          fileContents: fr.result,
        });
      });
      fr.readAsText(event.target.files[0]);
    }
  }

  errorSection() {
    if (this.state.errorMessage.length === 0) {
      return this.emptyErrorSection();
    }
    return (
      <div
        key={this.state.errorMessageKey}
        id={this.state.errorMessageKey}
      >
        {this.errorText()}
      </div>
    );
  }

  emptyErrorSection() {
    return (
      <div
        key={this.state.errorMessageKey}
        id={this.state.errorMessageKey}
      ></div>
    );
  }

  errorText() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '0px 0px 0px 0px',
          fontSize: '14px',
          color: 'red',
          animationName: 'fadein',
          animationDuration: '0.75s',
        }}
      >
        <b>{this.state.errorMessage}</b>
      </p>
    );
  }

  submitSection() {
    return (
      <div style={{ margin: '6px 0px 0px 0px' }} >
        <button
          onClick={() => this.submit()}
          style={{
            padding: '4px 32px 4px 32px',
            fontSize: '12px',
            borderRadius: '2px',
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  submit() {
    if (!this.state.fileContents) {
      if (this.state.attemptedFileLoad) {
        this.setState({
          errorMessage: 'Unable to read selected file.',
          errorMessageKey: uuidv1(),
        });
      } else {
        this.setState({
          errorMessage: 'No file uploaded.',
          errorMessageKey: uuidv1(),
        });
      }
      return;
    }
    this.props.submit(this.state.fileContents);
  }
}

OpenRna2drawer.propTypes = {
  width: PropTypes.string,
  submit: PropTypes.func,
};

OpenRna2drawer.defaultProps = {
  width: '100vw',
  submit: () => {},
};

export {
  OpenRna2drawer,
};
