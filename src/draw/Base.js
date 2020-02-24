import createUUIDforSVG from './createUUIDforSVG';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import CircleBaseAnnotation from './BaseAnnotation';
import Numbering from './Numbering';

class Base {

  /**
   * @param {SVG.Doc} svg 
   * @param {string} letter 
   * @param {number} xCenter 
   * @param {number} yCenter 
   * 
   * @returns {Base} 
   */
  static create(svg, letter, xCenter, yCenter) {
    let text = svg.text((add) => add.tspan(letter));
    text.id(createUUIDforSVG());

    text.attr({
      'x': xCenter,
      'y': yCenter,
      'text-anchor': 'middle',
      'dy': '0.4em',
    });

    return new Base(text);
  }

  /**
   * @param {SVG.Text} text 
   */
  constructor(text) {
    this._text = text;
    this._validateText();
    
    this._highlighting = null;
    this._outline = null;
    this._numbering = null;
    this._annotations = [];
  }

  /**
   * @throws {Error} If the ID of the text is not a string or is an empty string.
   * @throws {Error} If the text content is not a single character.
   * @throws {Error} If the text-anchor property is not middle.
   * @throws {Error} If the dy property is not 0.4em.
   */
  _validateText() {

    /* Use this._text.attr('id') instead of this._text.id() since this._text.id()
    will automatically set the ID if it is undefined. */
    if (typeof(this._text.attr('id')) !== 'string' || this._text.attr('id').length === 0) {
      throw new Error('Invalid ID.');
    }

    if (this._text.text().length !== 1) {
      throw new Error('The text content must be a single character.');
    }

    if (this._text.attr('text-anchor') !== 'middle') {
      throw new Error('The text-anchor property must be middle.');
    }

    if (this._text.attr('dy') !== '0.4em') {
      throw new Error('The dy property must be 0.4em.');
    }
  }

  /**
   * @returns {string} 
   */
  get id() {
    return this._text.id();
  }

  /**
   * @returns {string} 
   */
  get letter() {
    return this._text.text();
  }

  /**
   * @returns {number} 
   */
  get xCenter() {
    return this._text.attr('x');
  }

  /**
   * @returns {number} 
   */
  get yCenter() {
    return this._text.attr('y');
  }

  /**
   * @param {number} xCenter 
   * @param {number} yCenter 
   * @param {number} clockwiseNormalAngle 
   * @param {number} outerNormalAngle 
   */
  move(xCenter, yCenter, clockwiseNormalAngle, outerNormalAngle) {
    this._text.attr({
      'x': xCenter,
      'y': yCenter
    });

    if (this._highlighting !== null) {
      this._highlighting.reposition(xCenter, yCenter, clockwiseNormalAngle);
    }

    if (this._outline !== null) {
      this._outline.reposition(xCenter, yCenter, clockwiseNormalAngle);
    }

    if (this._numbering !== null) {
      this._numbering.reposition(xCenter, yCenter, outerNormalAngle);
    }

    this._annotations.forEach(
      ann => ann.reposition(xCenter, yCenter, clockwiseNormalAngle)
    );
  }

  /**
   * @param {Base} other 
   * 
   * @returns {number} 
   */
  distanceBetweenCenters(other) {
    return distanceBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }

  /**
   * @param {Base} other 
   * 
   * @returns {number} 
   */
  angleBetweenCenters(other) {
    return angleBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }

  /**
   * @returns {string} 
   */
  get fontFamily() {
    return this._text.attr('font-family');
  }

  /**
   * @param {string} ff 
   */
  set fontFamily(ff) {
    this._text.attr({ 'font-family': ff });
  }

  /**
   * @returns {number} 
   */
  get fontSize() {
    return this._text.attr('font-size');
  }

  /**]
   * @param {number} fs 
   */
  set fontSize(fs) {
    this._text.attr({ 'font-size': fs });
  }

  /**
   * @returns {string|number} 
   */
  get fontWeight() {
    return this._text.attr('font-weight');
  }

  /**
   * @param {string|number} fw 
   */
  set fontWeight(fw) {
    this._text.attr({ 'font-weight': fw });
  }

  /**
   * @returns {string} 
   */
  get fontStyle() {
    return this._text.attr('font-style');
  }

  /**
   * @param {string} fs 
   */
  set fontStyle(fs) {
    this._text.attr({ 'font-style': fs });
  }

  /**
   * @param {function} callback 
   */
  bindMouseover(callback) {
    this._text.mouseover(callback);
  }

  /**
   * @param {function} callback 
   */
  bindMouseout(callback) {
    this._text.mouseout(callback);
  }

  /**
   * @param {function} callback 
   */
  bindMousedown(callback) {
    this._text.mousedown(callback);
  }

  /**
   * @param {function} callback 
   */
  bindDblclick(callback) {
    this._text.dblclick(callback);
  }

  /**
   * @returns {string} 
   */
  get cursor() {
    return this._text.css('cursor');
  }

  /**
   * @param {string} c 
   */
  set cursor(c) {
    this._text.css({ 'cursor': c });
  }

  /**
   * @param {SVG.Doc} svg 
   */
  addCircleHighlighting(svg) {
    this.removeHighlighting();

    this._highlighting = CircleBaseAnnotation.createNondisplaced(
      svg, this.xCenter, this.yCenter
    );
  }

  removeHighlighting() {
    if (this._highlighting !== null) {
      this._highlighting.remove();
      this._highlighting = null;
    }
  }

  /**
   * @param {SVG.Doc} svg 
   */
  addCircleOutline(svg) {
    this.removeOutline();

    this._outline = CircleBaseAnnotation.createNondisplaced(
      svg, this.xCenter, this.yCenter
    );
  }

  removeOutline() {
    if (this._outline !== null) {
      this._outline.remove();
      this._outline = null;
    }
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {number} number 
   * @param {number} outerNormalAngle 
   */
  addNumbering(svg, number, outerNormalAngle) {
    this.removeNumbering();

    this._numbering = Numbering.create(
      svg, number, this.xCenter, this.yCenter, outerNormalAngle
    );
  }

  removeNumbering() {
    if (this._numbering !== null) {
      this._numbering.remove();
      this._numbering = null;
    }
  }

  /**
   * @param {SVG.Doc} svg 
   */
  addCircleAnnotation(svg) {
    this._annotations.push(CircleBaseAnnotation.createNondisplaced(
      svg, this.xCenter, this.yCenter
    ));
  }

  /**
   * @param {string} id 
   */
  removeAnnotation(id) {
    let i = null;

    for (let j = 0; j < this._annotations.length; j++) {
      if (this._annotations[j].id === id) {
        i = j;
      }
    }

    if (i !== null) {
      this._annotations[i].remove();
      this._annotations.splice(i, 1);
    }
  }

  /**
   * @returns {Object} 
   */
  savableState() {
    let savableState = {
      className: 'Base',
      text: this._text.id(),
      highlighting: null,
      outline: null,
      numbering: null,
      annotations: [],
    };

    if (this._highlighting !== null) {
      savableState.highlighting = this._highlighting.savableState();
    }

    if (this._outline !== null) {
      savableState.outline = this._outline.savableState();
    }

    if (this._numbering !== null) {
      savableState.numbering = this._numbering.savableState();
    }

    this._annotations.forEach(
      ann => savableState.annotations.push(ann.savableState())
    );
  }
}

export default Base;
