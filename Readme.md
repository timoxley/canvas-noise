
# canvas-noise

  Generate noise on a canvas.

![//raw.github.com/timoxley/canvas-noise/master/examples/example.png](//raw.github.com/timoxley/canvas-noise/master/examples/example.png)

## Installation

    $ component install timoxley/canvas-noise

## Example

```js
var noise = require('canvas-noise')

// This generated the 8 images above

noise(canvas1)
noise(canvas2).grayscale()
noise(canvas3).opacity(1)
noise(canvas4).opacity(1).brightness(0.5)
noise(canvas5).brightness(0.2).opacity(1)
noise(canvas6).opacity(1).saturation(1)
noise(canvas7).saturation(1)
noise(canvas8).opacity(1).brightness(0.3).grayscale()

```

## API

### Noise#opacity({Number}:opacity)

  Opacity of generated noise.

  Number between 0 and 1.

### Noise#saturation({Number}:saturation)

  Saturation of generated noise.

  Number between 0 and 1.

### Noise#brightness({Number}:brightness)

  Brightness of generated noise.

  Number between 0 and 1.

### Noise#grayscale()

  Enables grayscale mode. Randomises brightness instead of hue.

### Noise#color()

  Enables color mode. This is the default.
  Use this to disable grayscale mode.

### Noise#generate()

  Apply noise to canvas. Called implicitly on next tick on
  instantiation unless called explicitly.

  See animated example for more details on this.

## License

  MIT
