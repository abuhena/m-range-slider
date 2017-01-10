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
    this._private.get(this).fill.addEventListener('mouseover', this.seek.bind(this));
    this._private.get(this).toFill.addEventListener('mouseover', this.seek.bind(this));
  }
  
  seek(event) {
    console.info(event);
  }
}
