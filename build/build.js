
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("timoxley-next-tick/index.js", Function("exports, require, module",
"\"use strict\"\n\nif (typeof setImmediate == 'function') {\n  module.exports = function(f){ setImmediate(f) }\n}\n// legacy node.js\nelse if (typeof process != 'undefined' && typeof process.nextTick == 'function') {\n  module.exports = process.nextTick\n}\n// fallback for other environments / postMessage behaves badly on IE8\nelse if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {\n  module.exports = function(f){ setTimeout(f) };\n} else {\n  var q = [];\n\n  window.addEventListener('message', function(){\n    var i = 0;\n    while (i < q.length) {\n      try { q[i++](); }\n      catch (e) {\n        q = q.slice(i);\n        window.postMessage('tic!', '*');\n        throw e;\n      }\n    }\n    q.length = 0;\n  }, true);\n\n  module.exports = function(fn){\n    if (!q.length) window.postMessage('tic!', '*');\n    q.push(fn);\n  }\n}\n//@ sourceURL=timoxley-next-tick/index.js"
));
require.register("timoxley-color-convert/index.js", Function("exports, require, module",
"// Source: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript\n\nmodule.exports.RGBtoHSL = RGBtoHSL\nmodule.exports.HSLtoRGB = HSLtoRGB\nmodule.exports.RGBtoHSV = RGBtoHSV\nmodule.exports.HSVtoRGB = HSVtoRGB\n\n/**\n * Converts an RGB color value to HSL. Conversion formula\n * adapted from http://en.wikipedia.org/wiki/HSL_color_space.\n * Assumes r, g, and b are contained in the set [0, 255] and\n * returns h, s, and l in the set [0, 1].\n *\n * @param {Number} r The red color value\n * @param {Number} g The green color value\n * @param {Number} b The blue color value\n * @return {Array} The HSL representation\n * @api public\n */\n\nfunction RGBtoHSL(r, g, b){\n  r /= 255, g /= 255, b /= 255;\n  var max = Math.max(r, g, b), min = Math.min(r, g, b);\n  var h, s, l = (max + min) / 2;\n\n  if(max == min){\n    h = s = 0; // achromatic\n  }else{\n    var d = max - min;\n    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);\n    switch(max){\n      case r: h = (g - b) / d + (g < b ? 6 : 0); break;\n      case g: h = (b - r) / d + 2; break;\n      case b: h = (r - g) / d + 4; break;\n    }\n    h /= 6;\n  }\n\n  return [h, s, l];\n}\n\n/**\n * Converts an HSL color value to RGB. Conversion formula\n * adapted from http://en.wikipedia.org/wiki/HSL_color_space.\n * Assumes h, s, and l are contained in the set [0, 1] and\n * returns r, g, and b in the set [0, 255].\n *\n * @param {Number} h The hue\n * @param {Number} s The saturation\n * @param {Number} l The lightness\n * @return {Array} The RGB representation\n * @api public\n */\n\nfunction HSLtoRGB(h, s, l){\n  var r, g, b;\n\n  if(s == 0){\n    r = g = b = l; // achromatic\n  }else{\n    function hue2rgb(p, q, t){\n      if(t < 0) t += 1;\n      if(t > 1) t -= 1;\n      if(t < 1/6) return p + (q - p) * 6 * t;\n      if(t < 1/2) return q;\n      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;\n      return p;\n    }\n\n    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;\n    var p = 2 * l - q;\n    r = hue2rgb(p, q, h + 1/3);\n    g = hue2rgb(p, q, h);\n    b = hue2rgb(p, q, h - 1/3);\n  }\n\n  return [r * 255, g * 255, b * 255];\n}\n\n/**\n * Converts an RGB color value to HSV. Conversion formula\n * adapted from http://en.wikipedia.org/wiki/HSV_color_space.\n * Assumes r, g, and b are contained in the set [0, 255] and\n * returns h, s, and v in the set [0, 1].\n *\n * @param {Number} r The red color value\n * @param {Number} g The green color value\n * @param {Number} b The blue color value\n * @return {Array} The HSV representation\n * @api public\n */\n\nfunction RGBtoHSV(r, g, b){\n  r = r/255, g = g/255, b = b/255;\n  var max = Math.max(r, g, b), min = Math.min(r, g, b);\n  var h, s, v = max;\n\n  var d = max - min;\n  s = max == 0 ? 0 : d / max;\n\n  if(max == min){\n    h = 0; // achromatic\n  }else{\n    switch(max){\n      case r: h = (g - b) / d + (g < b ? 6 : 0); break;\n      case g: h = (b - r) / d + 2; break;\n      case b: h = (r - g) / d + 4; break;\n    }\n    h /= 6;\n  }\n\n  return [h, s, v];\n}\n\n/**\n * Converts an HSV color value to RGB. Conversion formula\n * adapted from http://en.wikipedia.org/wiki/HSV_color_space.\n * Assumes h, s, and v are contained in the set [0, 1] and\n * returns r, g, and b in the set [0, 255].\n *\n * @param {Number} h The hue\n * @param {Number} s The saturation\n * @param {Number} v The value\n * @return {Array} The RGB representation\n * @api public\n */\n\nfunction HSVtoRGB(h, s, v){\n  var r, g, b;\n\n  var i = Math.floor(h * 6);\n  var f = h * 6 - i;\n  var p = v * (1 - s);\n  var q = v * (1 - f * s);\n  var t = v * (1 - (1 - f) * s);\n\n  switch(i % 6){\n    case 0: r = v, g = t, b = p; break;\n    case 1: r = q, g = v, b = p; break;\n    case 2: r = p, g = v, b = t; break;\n    case 3: r = p, g = q, b = v; break;\n    case 4: r = t, g = p, b = v; break;\n    case 5: r = v, g = p, b = q; break;\n  }\n\n  return [r * 255, g * 255, b * 255];\n}\n//@ sourceURL=timoxley-color-convert/index.js"
));
require.register("canvas-noise/index.js", Function("exports, require, module",
"var nextTick = require('next-tick')\nvar convert = require('color-convert')\n\n/**\n * Generate noise upon a supplied canvas instance.\n * Noise will be drawn to canvas on next tick.\n *\n * @param {CanvasElement} canvas\n * @api public\n */\n\nmodule.exports = function(canvas) {\n  var noise = new Noise({\n    canvas: canvas\n  })\n  nextTick(function() {\n    noise._auto && noise.generate()\n  })\n  return noise\n}\n\n/**\n * Constructor\n *\n * @api private\n */\n\nfunction Noise(options) {\n  options = options || {}\n  this.canvas = options.canvas\n  this._opacity = options.opacity || 0.2\n  this._brightness = options.brightness || 0.5\n  this._saturation = options.saturation || 0.9\n  this._grayscale = !! options.grayscale\n  this._auto = true\n}\n\n/**\n * Opacity of generated noise.\n *\n * Number between 0 and 1.\n *\n * @param {Number} opacity between 0 and 1.\n * @api public\n */\n\nNoise.prototype.opacity = function(opacity) {\n  this._opacity = opacity\n  return this\n}\n\n/**\n * Saturation of generated noise.\n *\n * Number between 0 and 1.\n *\n * @param {Number} saturation\n * @api public\n */\n\nNoise.prototype.saturation = function(saturation) {\n  this._saturation = saturation\n  return this\n}\n\n/**\n * Brightness of generated noise.\n *\n * Number between 0 and 1.\n *\n * @param {Number} brightness\n * @api public\n */\n\nNoise.prototype.brightness = function(brightness) {\n  this._brightness = brightness\n  return this\n}\n\n/**\n * Enables grayscale mode. Randomises brightness instead of hue.\n *\n * @api public\n */\n\nNoise.prototype.grayscale = function() {\n  this._grayscale = true\n  return this\n}\n\n/**\n * Enables color mode. This is the default.\n * Use this to disable grayscale mode.\n *\n * @api public\n */\n\nNoise.prototype.color = function() {\n  this._grayscale = false\n  return this\n}\n\n/**\n * Apply noise to canvas. Called implicitly on next tick on\n * instantiation unless called explicitly.\n *\n * See animated example for more details on this.\n *\n * @api public\n */\n\nNoise.prototype.generate = function generate() {\n  this._auto = false\n  if (!this.canvas) return // canvas required\n  var canvas = this.canvas\n\n  // cache context\n  this.ctx = this.ctx || this.canvas.getContext('2d')\n  var ctx = this.ctx\n\n\n  var brightness = this._brightness\n  var grayscale = !! this._grayscale\n  var opacity = this._opacity\n\n  var saturation =  !grayscale ? this._saturation : 0\n\n  for ( var x = 0; x < canvas.width; x++ ) {\n    for ( var y = 0; y < canvas.height; y++ ) {\n\n      var hue = Math.random()\n\n      // randomize brightness instead of hue for grayscale mode\n      var adjustedBrightness = grayscale\n        ? brightness * Math.random() + brightness * 0.5\n        : brightness\n\n      var color = convert.HSLtoRGB(hue, saturation, adjustedBrightness)\n      var r = color[0], g = color[1], b = color[2] // destructuring plz\n\n      // Browser wants integers\n      r = Math.round(r)\n      g = Math.round(g)\n      b = Math.round(b)\n\n      // javascript sucks\n      ctx.fillStyle = \"rgba(\" + r + \",\" + g + \",\" + b + \",\" + opacity + \")\"\n      ctx.fillRect(x, y, 1, 1);\n    }\n  }\n  return this\n}\n//@ sourceURL=canvas-noise/index.js"
));
require.alias("timoxley-next-tick/index.js", "canvas-noise/deps/next-tick/index.js");
require.alias("timoxley-next-tick/index.js", "next-tick/index.js");

require.alias("timoxley-color-convert/index.js", "canvas-noise/deps/color-convert/index.js");
require.alias("timoxley-color-convert/index.js", "color-convert/index.js");

