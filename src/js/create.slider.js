/**
 * Created by Shariar Shaikot on 1/9/17.
 */

import findElements from './find.slider';

const singleton = Symbol();
const singletonEnforcer = Symbol();

export default class createElements {
  constructor(sym) {
    if (sym !== singletonEnforcer) throw new Error('Cannot construct singleton');
    this.findElement = findElements.instance;
    this.findElement.getSlidersByAttribute().forEach(each => {
      this.createCustom(each);
    });
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new createElements(singletonEnforcer);
    }
    return this[singleton];
  }
  
  createCustom(elem) {
    let startFrom = parseInt(elem.getAttribute('data-start'));
    let rangeEnd = parseInt(elem.getAttribute('data-range'));
    startFrom = (startFrom || startFrom !== 0) || this.findElement.defaultStart;
    rangeEnd = (rangeEnd || rangeEnd !== 0) || this.findElement.defaultRange;
    const body = document.createElement('div');
    body.className = 'mr-slider';
    
    const fill = document.createElement('div');
    fill.className = 'fill';
    const fillChild = document.createElement('div');
    fillChild.className = 'fill-child';
    fill.appendChild(fillChild);
    
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    
    const toFill = document.createElement('div');
    toFill.className = 'unfilled';
    const toFillChild = document.createElement('div');
    toFillChild.className = 'unfill-child';
    toFill.appendChild(toFillChild);
    
    body.appendChild(fill);
    body.appendChild(thumb);
    body.appendChild(toFill);
    elem.appendChild(body);
    const slider = this.findElement.getSliderByContext(elem);
    slider.fill = startFrom;
  }
}