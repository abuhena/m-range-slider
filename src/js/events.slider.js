/**
 * Created by Shariar Shaikot on 1/10/17.
 */

import findElements from './find.slider';

export default class EventsSlider {
  constructor(context) {
    this._private = new WeakMap();
    this._private.set(this, {
      elem: context,
      fill: context.childNodes[0].childNodes[0],
      thumb: context.childNodes[0].childNodes[1],
      toFill: context.childNodes[0].childNodes[2],
    });
    this.defaultStart = 0;
    this.defaultRange = 100;
    this.thumbSize = 20;
  }
  
  bindchange(cb) {
    if (cb) window.customChangeCB = cb;
  }

  /**
   * @param cb
   * @param auto
   */
  bindmouseover(cb, auto = false) {
    if (auto) this.customEventCB = cb;
    this._private.get(this).fill.addEventListener('mouseover', this.seekIntent.bind(this));
    this._private.get(this).toFill.addEventListener('mouseover', this.seekIntent.bind(this));
  }

  bindthumbmove() {
    this._private.get(this).thumb.addEventListener('mousedown', function () {
      console.info('mousedown');
      this.mousedown = true;
    }.bind(this));
    document.addEventListener('mouseup', function () {
      if (this.mousedown) {
        console.info('mouseup');
        this.mousedown = false;
      }
    }.bind(this));
    this._private.get(this).fill.addEventListener('mousemove', this.thumbMove.bind(this));
    this._private.get(this).toFill.addEventListener('mousemove', this.thumbMove.bind(this));

    this._private.get(this).fill.addEventListener('click', this.seeked.bind(this));
    this._private.get(this).toFill.addEventListener('click', this.seeked.bind(this));
  }

  /**
   * @param event
   */
  seekIntent(event) {
    if (this.customEventCB) {
      let rangeEnd = parseInt(this._private.get(this).elem.getAttribute('data-range'));
      rangeEnd = !rangeEnd ? this.defaultRange : rangeEnd;
      let onLeft = event.offsetX;
      onLeft = event.target.classList.contains('fill') ? onLeft: onLeft + this._private.get(this).fill.clientWidth + this.thumbSize;

      const fillIntentAreaPercent = ((onLeft / this._private.get(this).elem.clientWidth) * 100);
      const fillIntentArea = rangeEnd * fillIntentAreaPercent / 100;
      this.customEventCB({position: {
        canFill: Math.ceil(fillIntentArea),
        canFillPX: onLeft
      }});
    }
  }

  /**
   * @param event
   */
  seeked(event) {
    let rangeEnd = parseInt(this._private.get(this).elem.getAttribute('data-range'));
    rangeEnd = !rangeEnd ? this.defaultRange : rangeEnd;
    let onLeft = event.offsetX;
    onLeft = event.target.classList.contains('fill') ? onLeft: onLeft + this._private.get(this).fill.clientWidth + this.thumbSize;

    const fillIntentAreaPercent = ((onLeft / this._private.get(this).elem.clientWidth) * 100);
    const fillIntentArea = rangeEnd * fillIntentAreaPercent / 100;
    console.info(fillIntentArea);
    findElements.instance.getSliderByContext(this._private.get(this).elem).fill = fillIntentArea;
  }

  /**
   * @param event
   */
  thumbMove(event) {
    if (this.mousedown) {
      let rangeEnd = parseInt(this._private.get(this).elem.getAttribute('data-range'));
      rangeEnd = !rangeEnd ? this.defaultRange : rangeEnd;
      let onLeft = event.offsetX;
      onLeft = event.target.classList.contains('fill') ? onLeft: onLeft + this._private.get(this).fill.clientWidth + this.thumbSize;

      const fillIntentAreaPercent = ((onLeft / this._private.get(this).elem.clientWidth) * 100);
      const fillIntentArea = rangeEnd * fillIntentAreaPercent / 100;
      //console.info(fillIntentArea, onLeft);
      this.configObject(this._private.get(this).elem).fill = fillIntentArea;
    }
  }

  configObject(context) {
    const that = this;
    return {
      set fill(range) {
        let startFrom = parseInt(that._private.get(that).elem.getAttribute('data-start'));
        let rangeEnd = parseInt(that._private.get(that).elem.getAttribute('data-range'));
        startFrom = !startFrom ? that.defaultStart : startFrom;
        rangeEnd = !rangeEnd ? that.defaultRange : rangeEnd;
        if (range >= startFrom && range <= rangeEnd) {
          const fillArea = ((that._private.get(that).elem.clientWidth / rangeEnd) * range);
          const thumbArea = 20;
          that._private.get(that).fill.style.width = `${fillArea}px`;
          that._private.get(that).thumb.style.left = `${fillArea}px`;
          that._private.get(that).toFill.style.width = `${that._private.get(that).elem.clientWidth - fillArea - thumbArea}px`;
          that._private.get(that).elem.setAttribute('data-fill', range);
          if (window.customChangeCB) {
            window.customChangeCB({position: {
              fill: range,
              fillPX: fillArea
            }});
          }
          return true;
        }
        return false;
      },
      get fill() {
        let rangeEnd = parseFloat(that._private.get(that).elem.getAttribute('data-range'));
        rangeEnd = (rangeEnd || rangeEnd !== 0) || that.defaultRange;
        const currentFill = ((that._private.get(that).fill.clientWidth * rangeEnd)
        / this._private.get(that).elem.clientWidth);
        if (parseFloat(that._private.get(that).elem.getAttribute('data-fill')) === currentFill) {
          return currentFill;
        }
      }
    }
  }
}
