/**
 * Created by Shariar Shaikot on 1/10/17.
 */

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

  /**
   * @param cb
   * @param auto
   */
  bindmouseover(cb, auto = false) {
    if (auto) this.customEventCB = cb;
    this._private.get(this).fill.addEventListener('mouseover', this.seekIntent.bind(this));
    this._private.get(this).toFill.addEventListener('mouseover', this.seekIntent.bind(this));
  }
  
  seekIntent(event) {
    if (this.customEventCB) {
      console.info(this._private.get(this).elem.clientWidth);
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
}
