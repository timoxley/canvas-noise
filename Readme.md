
# canvas-noise

  Generate noise on a canvas.

## Installation

    $ component install timoxley/canvas-noise

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
