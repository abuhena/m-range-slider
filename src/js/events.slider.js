/**
 * Created by Shariar Shaikot on 1/10/17.
 */

export default class EventsSlider {
  /**
   * @param context
   */
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

  /**
   * @param cb
   */
  bindchange(cb) {
    if (cb) this.customChangeCB = cb;
  }

  /**
   * @param cb
   * @param auto
   */
  bindmouseover(cb, auto = false) {
    if (auto) this.customEventCB = cb;
    const fill = this._private.get(this).fill;
    const toFill = this._private.get(this).toFill;
    fill.addEventListener('mouseover', this.seekIntent.bind(this));
    toFill.addEventListener('mouseover', this.seekIntent.bind(this));
  }

  bindthumbmove() {
    this._private.get(this).thumb.addEventListener('mousedown', function () {
      this.mousedown = true;
    }.bind(this));
    document.addEventListener('mouseup', function () {
      if (this.mousedown) {
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
      this.customEventCB({
        fill: fillIntentArea,
        fillArea: onLeft
      });
    }
  }

  /**
   * @param event
   */
  seeked(event) {
    let rangeEnd = parseInt(this._private.get(this).elem.getAttribute('data-range'));
    rangeEnd = !rangeEnd ? this.defaultRange : rangeEnd;
    let onLeft = event.offsetX;
    onLeft = event.target.classList.contains('fill') || event.target.classList.contains('fill-child') ? onLeft: onLeft + this._private.get(this).fill.clientWidth + this.thumbSize;
    //change transition time while seeking through mouse
    const fillIntentAreaPercent = ((onLeft / this._private.get(this).elem.clientWidth) * 100);
    this.configObject().fill = rangeEnd * fillIntentAreaPercent / 100;
  }

  /**
   * @param event
   */
  thumbMove(event) {
    if (this.mousedown) {
      let rangeEnd = parseInt(this._private.get(this).elem.getAttribute('data-range'));
      rangeEnd = !rangeEnd ? this.defaultRange : rangeEnd;
      let onLeft = event.offsetX;
      let distance = this._private.get(this).fill.clientWidth;

      onLeft = event.target.classList.contains('fill') || event.target.classList.contains('fill-child') ? onLeft: onLeft + distance + this.thumbSize;

      const fillIntentAreaPercent = ((onLeft / this._private.get(this).elem.clientWidth) * 100);
      this.configObject().fill = rangeEnd * fillIntentAreaPercent / 100;
    }
  }

  /**
   * @param context
   * @returns {{fill, fill}}
   */
  configObject(context) {
    const that = this;
    return {
      /**
       * @param range
       */
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
          if (that.customChangeCB) {
            that.customChangeCB({
              fill: range,
              fillArea: fillArea
            });
          }
        }
      },
      /**
       * @returns {number}
       */
      get fill() {
        return Number(that._private.get(that).elem.getAttribute('data-fill'));
      }
    }
  }
}
