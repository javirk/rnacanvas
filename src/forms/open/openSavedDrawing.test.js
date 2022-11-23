import { App } from 'App';

import * as SVG from 'Draw/svg/NodeSVG';

import * as fs from 'fs';

import { parseRna2drawer1 } from './parseRna2drawer1';

import { openSavedDrawing } from './openSavedDrawing';

function readRna2drawer1(name) {
  return fs.readFileSync('testinput/rna2drawer1/' + name + '.rna2drawer', 'utf8');
}

function readRna2drawer2(name) {
  return fs.readFileSync('testinput/rna2drawer2/' + name + '.rna2drawer2', 'utf8');
}

// needed for parseRna2drawer1 function to run
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return { color: 'rgb(0, 0, 0)' };
  }
});

let app = null;

beforeEach(() => {
  app = new App({ SVG });
  app.appendTo(document.body);
});

afterEach(() => {
  app.remove();
  app = null;
});

describe('openSavedDrawing function', () => {
  describe('opening drawings from before the web app', () => {
    test('a valid drawing file', () => {
      let contents = readRna2drawer1('hairpin');
      expect(parseRna2drawer1(contents)).toBeTruthy(); // is parsable
      expect(() => {
        openSavedDrawing({ app, extension: 'rna2drawer', contents: contents });
      }).not.toThrow();
      expect(app.strictDrawing.isEmpty()).toBeFalsy(); // saved drawing was added
    });

    test('an invalid drawing file', () => {
      let contents = readRna2drawer1('baseOutlineWithInvalidStrokeWidth');
      expect(contents).toBeTruthy(); // file was read
      expect(parseRna2drawer1(contents)).toBeFalsy(); // unparsable
      expect(() => {
        openSavedDrawing({ app, extension: 'rna2drawer', contents: contents });
      }).toThrow();
      expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
    });
  });

  describe('opening drawings produced by the web app', () => {
    test('a valid drawing file', () => {
      let contents = readRna2drawer2('hairpins');
      expect(() => {
        openSavedDrawing({ app, extension: 'rna2drawer2', contents: contents });
      }).not.toThrow();
      expect(app.strictDrawing.isEmpty()).toBeFalsy(); // saved drawing was applied
    });

    test('invalid JSON', () => {
      let contents = '{ asdf: 2, qwer: 5 ';
      expect(() => {
        openSavedDrawing({ app, extension: 'rna2drawer2', contents: contents });
      }).toThrow();
      expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
    });

    test('when the saved state in unable to be applied', () => {
      let contents = readRna2drawer2('invalidBaseTextId');
      expect(JSON.parse(contents)).toBeTruthy(); // is parsable
      expect(() => {
        openSavedDrawing({ app, extension: 'rna2drawer2', contents: contents });
      }).toThrow();
      expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
    });
  });

  test('a file with an unrecognized extension', () => {
    expect(() => {
      openSavedDrawing({ app, extension: 'asdf', contents: 'asdfasdf' });
    }).toThrow();
  });
});
