import createUUIDforSVG from './createUUIDforSVG';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import CircleBaseAnnotation from './BaseAnnotation';
import Numbering from './Numbering';

class Base {

  /**
   * @param {Base~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} clockwiseNormalAngle 
   * 
   * @throws {Error} If the saved state is not for a base.
   */
  static fromSavedState(savedState, svg, clockwiseNormalAngle) {
    if (savedState.className !== 'Base') {
      throw new Error('Saved state is not for a base.');
    }

    let text = svg.findOne(savedState.text);
    let b = new Base(text);

    if (savedState.highlighting) {
      b.addCircleHighlightingFromSavedState(savedState.highlighting, svg, clockwiseNormalAngle);
    }

    if (savedState.outline) {
      b.addCircleOutlineFromSavedState(savedState.outline, svg, clockwiseNormalAngle);
    }

    if (savedState.numbering) {
      b.addNumberingFromSavedState(savedState.numbering, svg);
    }

    savedState.annotations.forEach(
      ann => b.addCircleAnnotationFromSavedState(ann, svg, clockwiseNormalAngle)
    );

    return b;
  }

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

  /**
   * @param {CircleBaseAnnotation~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} clockwiseNormalAngle 
   */
  addCircleHighlightingFromSavedState(savedState, svg, clockwiseNormalAngle) {
    this.removeHighlighting();

    this._highlighting = CircleBaseAnnotation.fromSavedState(
      savedState,
      svg,
      this.xCenter,
      this.yCenter,
      clockwiseNormalAngle,
    );
  }

  removeHighlighting() {
    if (this._highlighting !== null) {
      this._highlighting.remove();
      this._highlighting = null;
    }
  }

  /**
   * @returns {number} 
   */
  get highlightingRadius() {
    return this._highlighting.radius;
  }

  /**
   * @param {number} r 
   */
  set highlightingRadius(r) {
    this._highlighting.radius = r;
  }

  /**
   * @returns {string} 
   */
  get highlightingFill() {
    return this._highlighting.fill;
  }

  /**
   * @param {string} f 
   */
  set highlightingFill(f) {
    this._highlighting.fill = f;
  }

  /**
   * @returns {number} 
   */
  get highlightingFillOpacity() {
    return this._highlighting.fillOpacity;
  }

  /**
   * @param {number} fo 
   */
  set highlightingFillOpacity(fo) {
    this._highlighting.fillOpacity = fo;
  }

  /**
   * @returns {string} 
   */
  get highlightingStroke() {
    return this._highlighting.stroke;
  }

  /**
   * @param {string} s 
   */
  set highlightingStroke(s) {
    this._highlighting.stroke = s;
  }

  /**
   * @returns {number} 
   */
  get highlightingStrokeWidth() {
    return this._highlighting.strokeWidth;
  }

  /**
   * @param {number} sw 
   */
  set highlightingStrokeWidth(sw) {
    this._highlighting.strokeWidth = sw;
  }

  /**
   * @returns {number} 
   */
  get highlightingStrokeOpacity() {
    return this._highlighting.strokeOpacity;
  }

  /**
   * @param {number} so 
   */
  set highlightingStrokeOpacity(so) {
    this._highlighting.strokeOpacity = so;
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

  /**
   * @param {CircleBaseAnnotation~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} clockwiseNormalAngle 
   */
  addCircleOutlineFromSavedState(savedState, svg, clockwiseNormalAngle) {
    this.removeOutline();

    this._outline = CircleBaseAnnotation.fromSavedState(
      savedState,
      svg,
      this.xCenter,
      this.yCenter,
      clockwiseNormalAngle,
    );
  }

  removeOutline() {
    if (this._outline !== null) {
      this._outline.remove();
      this._outline = null;
    }
  }

  /**
   * @returns {number} 
   */
  get outlineRadius() {
    return this._outline.radius;
  }

  /**
   * @param {number} r 
   */
  set outlineRadius(r) {
    this._outline.radius = r;
  }

  /**
   * @returns {string} 
   */
  get outlineFill() {
    return this._outline.fill;
  }

  /**
   * @param {string} f 
   */
  set outlineFill(f) {
    this._outline.fill = f;
  }

  /**
   * @returns {number} 
   */
  get outlineFillOpacity() {
    return this._outline.fillOpacity;
  }

  /**
   * @param {number} fo 
   */
  set outlineFillOpacity(fo) {
    this._outline.fillOpacity = fo;
  }

  /**
   * @returns {string} 
   */
  get outlineStroke() {
    return this._outline.stroke;
  }

  /**
   * @param {string} s 
   */
  set outlineStroke(s) {
    this._outline.stroke = s;
  }

  /**
   * @returns {number} 
   */
  get outlineStrokeWidth() {
    return this._outline.strokeWidth;
  }

  /**
   * @param {number} sw 
   */
  set outlineStrokeWidth(sw) {
    this._outline.strokeWidth = sw;
  }

  /**
   * @returns {number} 
   */
  get outlineStrokeOpacity() {
    return this._outline.strokeOpacity;
  }

  /**
   * @param {number} so 
   */
  set outlineStrokeOpacity(so) {
    this._outline.strokeOpacity = so;
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

  /**
   * @param {Numbering~SavableState} savedState 
   * @param {SVG.Doc} svg 
   */
  addNumberingFromSavedState(savedState, svg) {
    this.removeNumbering();

    this._numbering = Numbering.fromSavedState(
      savedState,
      svg,
      this.xCenter,
      this.yCenter,
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
   * @param {CircleBaseAnnotation~SavableState} savedState 
   * @param {SVG.Doc} svg 
   * @param {number} clockwiseNormalAngle 
   */
  addCircleAnnotationFromSavedState(savedState, svg, clockwiseNormalAngle) {
    this._annotations.push(CircleBaseAnnotation.fromSavedState(
      savedState,
      svg,
      this.xCenter,
      this.yCenter,
      clockwiseNormalAngle,
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
   * @typedef {Object} Base~SavableState 
   * @property {string} className 
   * @property {string} text 
   * @property {CircleBaseAnnotation~SavableState|undefined} highlighting 
   * @property {CircleBaseAnnotation~SavableState|undefined} outline 
   * @property {Numbering~SavableState|undefined} numbering 
   * @property {Array<CircleBaseAnnotation~SavableState>} annotations 
   */

  /**
   * @returns {Base~SavableState} 
   */
  savableState() {
    let savableState = {
      className: 'Base',
      text: this._text.id(),
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

    savableState.annotations = [];

    this._annotations.forEach(
      ann => savableState.annotations.push(ann.savableState())
    );
  }
}

export default Base;
