import Base from './Base';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class Sequence {

  /**
   * @typedef {Object} Sequence~BaseCoordinates 
   * @property {number} xCenter 
   * @property {number} yCenter 
   */

  /**
   * @param {Sequence~BaseCoordinates} cs1 
   * @param {Sequence~BaseCoordinates} cs2 
   */
  static _angleBetweenBaseCenters(cs1, cs2) {
    return angleBetween(cs1.xCenter, cs1.yCenter, cs2.xCenter, cs2.yCenter);
  }

  /**
   * @param {Sequence~BaseCoordinates} cs 
   * @param {Sequence~BaseCoordinates|null} cs5 
   * @param {Sequence~BaseCoordinates|null} cs3 
   */
  static _baseClockwiseNormalAngle(cs, cs5, cs3) {
    if (cs5 === null && cs3 === null) {
      return Math.PI / 2;
    } else if (cs5 === null) {
      return Sequence._angleBetweenBaseCenters(cs, cs3) + (Math.PI / 2);
    } else if (cs3 === null) {
      return Sequence._angleBetweenBaseCenters(cs, cs5) - (Math.PI / 2);
    } else {
      let a5 = Sequence._angleBetweenBaseCenters(cs, cs5);
      let a3 = Sequence._angleBetweenBaseCenters(cs, cs3);
      a5 = normalizeAngle(a5, a3);
      return (a5 + a3) / 2;
    }
  }

  /**
   * @param {Sequence~BaseCoordinates} cs 
   * @param {Sequence~BaseCoordinates|null} cs5 
   * @param {Sequence~BaseCoordinates|null} cs3 
   */
  static _baseInnerNormalAngle(cs, cs5, cs3) {
    let cna = Sequence._baseClockwiseNormalAngle(cs, cs5, cs3);
    
    if (cs5 === null || cs3 === null) {
      return ca;
    } else {
      let a5 = Sequence._angleBetweenBaseCenters(cs, cs5);
      let a3 = Sequence._angleBetweenBaseCenters(cs, cs3);
      a5 = normalizeAngle(a5, a3);

      if (a5 - a3 < Math.PI) {
        return (a5 + a3) / 2;
      } else {
        a3 = normalizeAngle(a3, a5);
        return (a5 + a3) / 2;
      }
    }
  }

  /**
   * @param {Sequence~SavableState} savedState 
   * @param {SVG.Doc} svg 
   */
  static fromSavedState(savedState, svg) {
    let seq = new Sequence(savedState.id);
    seq.numberingOffset = savedState.numberingOffset;

    for (let p = 1; p <= savedState.bases.length; p++) {
      let sb = savedState.bases[p - 1];
      
      let cs = {
        xCenter: Base.xCenterFromSavedState(sb),
        yCenter: Base.yCenterFromSavedState(sb),
      };
      
      let cs5 = null;
      let cs3 = null;

      if (p > 1) {
        let sb5 = savedState.bases[p - 2];
        
        cs5 = {
          xCenter: Base.xCenterFromSavedState(sb5),
          yCenter: Base.yCenterFromSavedState(sb5),
        };
      }

      if (p < savedState.bases.length) {
        let sb3 = savedState.bases[p];

        cs3 = {
          xCenter: Base.xCenterFromSavedState(sb3),
          yCenter: Base.yCenterFromSavedState(sb3),
        };
      }

      let cna = Sequence._baseClockwiseNormalAngle(cs, cs5, cs3);
      seq.appendBase(Base.fromSavedState(sb, svg, cna));
    }
  }

  /**
   * @param {SVG.Doc} svg 
   * @param {string} id 
   * @param {string} letters 
   */
  static createOutOfView(svg, id, letters) {
    let seq = new Sequence(id);

    for (let i = 0; i < letters.length; i++) {
      let c = letters.charAt(i);
      seq.appendBase(Base.createOutOfView(svg, c));
    }

    return seq;
  }

  /**
   * @param {string} id 
   */
  constructor(id) {
    this._id = id;
    this._bases = [];
    this._numberingOffset = 0;
  }

  /**
   * @returns {string} The ID of this sequence.
   */
  get id() {
    return this._id;
  }

  /**
   * @returns {number} 
   */
  get numberingOffset() {
    return this._numberingOffset;
  }

  /**
   * @param {number} no 
   * 
   * @throws {Error} If the given numbering offset is not an integer.
   */
  set numberingOffset(no) {
    if (!isFinite(no) || Math.floor(no) !== no) {
      throw new Error('Numbering offset must be an integer.');
    }

    this._numberingOffset = no;
  }

  /**
   * @returns {number} The length of this sequence.
   */
  get length() {
    return this._bases.length;
  }

  /**
   * @param {number} p 
   * 
   * @returns {boolean} 
   */
  positionOutOfRange(p) {
    return p < 1 || p > this.length;
  }

  /**
   * @param {number} p 
   * 
   * @returns {boolean} 
   */
  positionInRange(p) {
    return !this.positionOutOfRange(p);
  }

  /**
   * @param {number} op 
   * 
   * @returns {boolean} 
   */
  offsetPositionOutOfRange(op) {
    return this.positionOutOfRange(op - this.numberingOffset);
  }

  /**
   * @param {number} op 
   * 
   * @returns {boolean} 
   */
  offsetPositionInRange(op) {
    return this.positionInRange(p - this.numberingOffset);
  }

  /**
   * Returns null if the position is out of the range of this sequence.
   * 
   * @param {number} p 
   * 
   * @returns {Base|null} 
   */
  getBaseByPosition(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      return this._bases[p - 1];
    }
  }

  /**
   * Returns null if the offset position is out of the offset range of this sequence.
   * 
   * @param {number} op 
   * 
   * @returns {Base|null} 
   */
  getBaseByOffsetPosition(op) {
    return this.getBaseByPosition(op - this.numberingOffset);
  }

  /**
   * Returns null if no base in this sequence has the given ID.
   * 
   * @param {string} id 
   * 
   * @returns {Base|null} 
   */
  getBaseById(id) {
    for (let p = 1; p <= this.length; p++) {
      let b = this.getBaseByPosition(p);
      
      if (b.id === id) {
        return b;
      }
    }

    return null;
  }

  /**
   * Returns negative one if the given base is not in this sequence.
   * 
   * @param {Base} b 
   * 
   * @returns {number} 
   */
  basePosition(b) {
    for (let p = 1; p <= this.length; p++) {
      if (this.getBaseByPosition(p).id === b.id) {
        return p;
      }
    }

    return -1;
  }

  /**
   * Returns the minimum offset position of this sequence minus one if
   * the given base is not in this sequence.
   * 
   * @param {Base} b 
   * 
   * @returns {number} 
   */
  baseOffsetPosition(b) {
    return this.basePosition + this.numberingOffset;
  }

  /**
   * Returns null if the position is out of the range of this sequence.
   * 
   * @param {number} p 
   * 
   * @returns {number|null} 
   */
  positionClockwiseNormalAngle(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      let b = this.getBaseByPosition(p);
      let cs = { xCenter: b.xCenter, yCenter: b.yCenter };
      
      let cs5 = null;
      let cs3 = null;
      
      if (p > 1) {
        b5 = this.getBaseByPosition(p - 1);
        cs5 = { xCenter: b5.xCenter, yCenter: b5.yCenter };
      }

      if (p < this.length) {
        b3 = this.getBaseByPosition(p + 1);
        cs3 = { xCenter: b3.xCenter, yCenter: b3.yCenter };
      }

      return Sequence._baseClockwiseNormalAngle(cs, cs5, cs3);
    }
  }

  positionCounterClockwiseNormalAngle(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      return Math.PI + this.positionClockwiseNormalAngle(p);
    }
  }

  /**
   * Returns null if the given position is out of range.
   * 
   * @param {number} p 
   * 
   * @returns {number|null} 
   */
  positionInnerNormalAngle(p) {
    if (this.positionOutOfRange()) {
      return null;
    } else {
      let b = this.getBaseByPosition(p);
      let cs = { xCenter: b.xCenter, yCenter: b.yCenter };
      
      let cs5 = null;
      let cs3 = null;
      
      if (p > 1) {
        b5 = this.getBaseByPosition(p - 1);
        cs5 = { xCenter: b5.xCenter, yCenter: b5.yCenter };
      }

      if (p < this.length) {
        b3 = this.getBaseByPosition(p + 1);
        cs3 = { xCenter: b3.xCenter, yCenter: b3.yCenter };
      }

      return Sequence._baseInnerNormalAngle(cs, cs5, cs3);
    }
  }

  /**
   * Returns null if the given position is out of range.
   * 
   * @param {number} p 
   * 
   * @returns {number|null} 
   */
  positionOuterNormalAngle(p) {
    if (this.positionOutOfRange(p)) {
      return null;
    } else {
      return Math.PI + this.positionInnerNormalAngle(p);
    }
  }

  /**
   * Appends the given base to the end of this sequence.
   * 
   * @param {Base} b 
   */
  appendBase(b) {
    this._bases.push(b);
  }

  /**
   * If the position is one plus the length of this sequence, the base will
   * be appended to the end of this sequence. If the position is otherwise
   * out of the range of this sequence, this method will have no effect.
   * 
   * @param {Base} b 
   * @param {number} p 
   */
  insertBaseAtPosition(b, p) {
    if (p === this.length + 1) {
      this.appendBase(b);
    } else if (this.positionInRange(p)) {
      this._bases.splice(p - 1, 0, b);
    }
  }

  /**
   * Has no effect if the given position is out of range.
   * 
   * @param {number} p 
   */
  removeBaseByPosition(p) {
    if (this.positionInRange(p)) {
      let b = this.getBaseByPosition(p);
      b.remove();
      this._bases.splice(p - 1, 1);
    }
  }

  /**
   * @typedef {Object} Sequence~SavableState 
   * @property {string} className 
   * @property {string} id 
   * @property {Array<Base~SavableState>} bases 
   * @property {number} numberingOffset 
   */

  /**
   * @returns {Sequence~SavableState} 
   */
  savableState() {
    let savableState = {
      className: 'Sequence',
      id: this.id,
      bases: [],
      numberingOffset: this.numberingOffset,
    };

    this._bases.forEach(
      b => savableState.bases.push(b.savableState())
    );

    return savableState;
  }
}

export default Sequence;
