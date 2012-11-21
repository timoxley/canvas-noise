var nextTick = require('next-tick')
var convert = require('color-convert')

/**
 * Generate noise upon a supplied canvas instance.
 * Noise will be drawn to canvas on next tick.
 *
 * @param {CanvasElement} canvas
 * @api public
 */

module.exports = function(canvas) {
  var noise = new Noise({
    canvas: canvas
  })
  nextTick(function() {
    noise._auto && noise.generate()
  })
  return noise
}

/**
 * Constructor
 *
 * @api private
 */

function Noise(options) {
  options = options || {}
  this.canvas = options.canvas
  this._opacity = options.opacity || 0.2
  this._brightness = options.brightness || 0.5
  this._saturation = options.saturation || 0.9
  this._grayscale = !! options.grayscale
  this._auto = true
}

/**
 * Opacity of generated noise.
 *
 * Number between 0 and 1.
 *
 * @param {Number} opacity between 0 and 1.
 * @api public
 */

Noise.prototype.opacity = function(opacity) {
  this._opacity = opacity
  return this
}

/**
 * Saturation of generated noise.
 *
 * Number between 0 and 1.
 *
 * @param {Number} saturation
 * @api public
 */

Noise.prototype.saturation = function(saturation) {
  this._saturation = saturation
  return this
}

/**
 * Brightness of generated noise.
 *
 * Number between 0 and 1.
 *
 * @param {Number} brightness
 * @api public
 */

Noise.prototype.brightness = function(brightness) {
  this._brightness = brightness
  return this
}

/**
 * Enables grayscale mode. Randomises brightness instead of hue.
 *
 * @api public
 */

Noise.prototype.grayscale = function() {
  this._grayscale = true
  return this
}

/**
 * Enables color mode. This is the default.
 * Use this to disable grayscale mode.
 *
 * @api public
 */

Noise.prototype.color = function() {
  this._grayscale = false
  return this
}

/**
 * Apply noise to canvas. Called implicitly on next tick on
 * instantiation unless called explicitly.
 *
 * See animated example for more details on this.
 *
 * @api public
 */

Noise.prototype.generate = function generate() {
  this._auto = false
  if (!this.canvas) return // canvas required
  var canvas = this.canvas

  // cache context
  this.ctx = this.ctx || this.canvas.getContext('2d')
  var ctx = this.ctx


  var brightness = this._brightness
  var grayscale = !! this._grayscale
  var opacity = this._opacity

  var saturation =  !grayscale ? this._saturation : 0

  for ( var x = 0; x < canvas.width; x++ ) {
    for ( var y = 0; y < canvas.height; y++ ) {

      var hue = Math.random()

      // randomize brightness instead of hue for grayscale mode
      var adjustedBrightness = grayscale
        ? brightness * Math.random() + brightness * 0.5
        : brightness

      var color = convert.HSLtoRGB(hue, saturation, adjustedBrightness)
      var r = color[0], g = color[1], b = color[2] // destructuring plz

      // Browser wants integers
      r = Math.round(r)
      g = Math.round(g)
      b = Math.round(b)

      // javascript sucks
      ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + opacity + ")"
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return this
}
