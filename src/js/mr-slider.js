/**
 * Created by Shariar Shaikot on 1/9/17.
 */

import createElement from './create.slider';

window.onload = function () {
  (function (instance, window) {
    window.MrSlider = function (id) {
      MrSlider.slider = instance.findElement.getSliderById(id);
      if (!MrSlider.slider) throw new Error(`Unable to find any slider corresponding #${id}`);
    }
  })(createElement.instance, window);
};