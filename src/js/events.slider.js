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
	window.addEventListener('resize', this.updateSize.bind(this));
    this.defaultStart = 0;
    this.defaultRange = 100;
    this.thumbSize = 20;
    this.customEventCB = [];
    this.customMoveEventCB = [];
    this.customChangeCB = [];
	this.customThumbsDownCB = [];
	this.customThumbsUpCB = [];
	this.customClickCB = [];
  }

  /**
   * @param cb
   */
  // bindchange(cb) {
  //   if (cb) this.customChangeCB = cb;
  // }

  /**
   * @param hex
   * @returns {*[]}
   */
  static hexToRGB(hex) {
    if (hex.length > 7) throw new Error('Unable to convert hex to RGB');
    const hexString = hex.toString().substr(1, 6);
    return [
      parseInt(hexString.substr(0, 2), 16),
      parseInt(hexString.substr(2, 2), 16),
      parseInt(hexString.substr(4, 2), 16)
    ];
  }

  /**
   * @param colorPalette
   */
  setColorPalette(colorPalette) {
    if (colorPalette && typeof colorPalette === 'object') {
      if (colorPalette.fill && colorPalette.fill.length > 6 && colorPalette.fill.length < 8) {
        let fillBGColor = EventsSlider.hexToRGB(colorPalette.fill);
        fillBGColor = `rgb(${fillBGColor[0]}, ${fillBGColor[1]}, ${fillBGColor[2]})`;
        this._private.get(this).fill.childNodes[0].style.backgroundColor = fillBGColor;
      }
      if (colorPalette.body && colorPalette.body.length > 6 && colorPalette.body.length < 8) {
        let bodyBGColor = EventsSlider.hexToRGB(colorPalette.body);
        bodyBGColor = `rgba(${bodyBGColor[0]}, ${bodyBGColor[1]}, ${bodyBGColor[2]}, 0.75)`;
        this._private.get(this).toFill.childNodes[0].style.backgroundColor = bodyBGColor;
      }
      if (colorPalette.thumb && colorPalette.thumb.length > 6 && colorPalette.thumb.length < 8) {
        let thumbBGColor = EventsSlider.hexToRGB(colorPalette.thumb);
        thumbBGColor = `rgb(${thumbBGColor[0]}, ${thumbBGColor[1]}, ${thumbBGColor[2]})`;
        this._private.get(this).thumb.style.borderColor = thumbBGColor;
      }
    }
  }

  /**
   * @param cb
   * @param auto
   */
  bindmouseover() {
    //if (auto) this.customEventCB = cb;
    const fill = this._private.get(this).fill;
    const toFill = this._private.get(this).toFill;
    fill.addEventListener('mouseover', this.seekIntent.bind(this));
    toFill.addEventListener('mouseover', this.seekIntent.bind(this));
  }
  
  bindmousemove() {
	//if (auto) this.customMoveEventCB = cb;
	const fill = this._private.get(this).fill;
    const toFill = this._private.get(this).toFill;
    fill.addEventListener('mousemove', this.seekIntent.bind(this));
    toFill.addEventListener('mousemove', this.seekIntent.bind(this));
  }
  
  bindmouseout(cb) {
	const fill = this._private.get(this).fill;
    const toFill = this._private.get(this).toFill;
	this._private.get(this).elem.addEventListener('mouseout', (event) => {
		const _private = this._private.get(this);
		if (event.target === toFill.firstChild || event.target === fill.firstChild || event.target === _private.thumb ||
		event.target === toFill || event.target === fill) {
				return;
			}
		return cb();
	});
  }

  bindthumbmove() {
    this._private.get(this).thumb.addEventListener('mousedown', function () {
      this.mousedown = true;
    }.bind(this));
    document.addEventListener('mouseup', function () {
      if (this.mousedown) {
		  this.customThumbsUpCB.forEach(each => {
			each();
		  });
        this.mousedown = false;
      }
    }.bind(this));
    this._private.get(this).fill.addEventListener('mousemove', this.thumbMove.bind(this));
    this._private.get(this).thumb.addEventListener('mousemove', this.thumbMove.bind(this));
    this._private.get(this).toFill.addEventListener('mousemove', this.thumbMove.bind(this));

    this._private.get(this).fill.addEventListener('click', this.seeked.bind(this));
    this._private.get(this).toFill.addEventListener('click', this.seeked.bind(this));
  }

  /**
   * @param event
   */
  seekIntent(event) {
    if (this.customEventCB || this.customMoveEventCB) {
      let rangeEnd = parseInt(this._private.get(this).elem.getAttribute('data-range'));
      rangeEnd = !rangeEnd ? this.defaultRange : rangeEnd;
      let onLeft = event.offsetX;
      onLeft = event.target.classList.contains('fill') ? onLeft: onLeft + this._private.get(this).fill.clientWidth; //thumbs removed

      const fillIntentAreaPercent = ((onLeft / this._private.get(this).elem.clientWidth) * 100);
      const fillIntentArea = rangeEnd * fillIntentAreaPercent / 100;

      this.customEventCB.forEach(each => {
        each({
          fill: fillIntentArea,
          fillArea: onLeft
        }, event);
      });
      this.customMoveEventCB.forEach(each => {
        each({
          fill: fillIntentArea,
          fillArea: onLeft
        }, event);
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
    onLeft = event.target.classList.contains('fill') || event.target.classList.contains('fill-child') ? onLeft: onLeft + this._private.get(this).fill.clientWidth; //thumbs removed
    //change transition time while seeking through mouse
    const fillIntentAreaPercent = ((onLeft / this._private.get(this).elem.clientWidth) * 100);
    this.configObject().fill = rangeEnd * fillIntentAreaPercent / 100;
	this.customClickCB.forEach(each => {
		each();
	});
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

      onLeft = event.target.classList.contains('fill') || event.target.classList.contains('fill-child') ? onLeft: onLeft + distance; //thumbs removed

      const fillIntentAreaPercent = ((onLeft / this._private.get(this).elem.clientWidth) * 100);
      this.configObject().fill = rangeEnd * fillIntentAreaPercent / 100;
	  this.customThumbsDownCB.forEach(each => {
		each();
	  });
    }
  }
  
  updateSize() {
	let range = this._private.get(this).elem.getAttribute('data-fill');
	if (range) {
		let startFrom = parseInt(this._private.get(this).elem.getAttribute('data-start'));
		let rangeEnd = parseInt(this._private.get(this).elem.getAttribute('data-range'));
		startFrom = !startFrom ? this.defaultStart : startFrom;
		rangeEnd = !rangeEnd ? this.defaultRange : rangeEnd;
		range = Number(range);
		const fillArea = ((this._private.get(this).elem.clientWidth / rangeEnd) * range);
        const thumbArea = 20;
        this._private.get(this).fill.style.width = `${fillArea}px`;
        this._private.get(this).thumb.style.left = `${fillArea}px`;
        this._private.get(this).toFill.style.width = `${this._private.get(this).elem.clientWidth - fillArea - thumbArea}px`;
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
          that.customChangeCB.forEach(each => {
            each({
              fill: range,
              fillArea
            });
          });
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
