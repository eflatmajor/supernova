class Vector2 {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }

  get x() { return this.i; }
  get y() { return this.j; }

  copy() {
    return new Vector2(this.i, this.j);
  }

  sub(vec) {
    if (vec instanceof Vector2) {
      this.i -= x.i || 0;
      this.j -= x.j || 0;
    }
    else if (Array.isArray(vec) && vec.length === 2) {
      this.i -= vec[0];
      this.j -= vec[1];
    }

    return this;
  }

  dist(vec) {
    return vec.copy().sub(this).mag();
  }

  mag() {
    return Math.sqrt(this.magSquared());
  }

  magSquared() {
    const i = this.i;
    const j = this.j;

    return i * i + j * j;
  }

  /*
    ALIASES
  */

  magnitude() { return this.mag(); }
  magnitudeSquared() { return this.magSquared(); }

  length() { return this.mag(); }
  lengthSquared() { return this.magSquared(); }
}

function randomFloat(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

function randomInt(min = 0, max = Number.MAX_SAFE_INTEGER, inclusive = false) {
  return Math.floor(randomFloat(min, max));
}

function randomRGB(withAlpha = false, min = 0, max = 255) {
  const r = clamp(randomInt(0, 255), min, max);
  const g = clamp(randomInt(0, 255), min, max);
  const b = clamp(randomInt(0, 255), min, max);

  if (withAlpha) {
    const a = randomFloat(0, 1.0);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function clamp(num, min, max) {
  return Math.max(Math.min(num, max), min);
}

function map(...args) {
  return remapRange(...args);
}

function remapRange(num, a1, a2, b1, b2) {
  return b1 + (num - a1) * (b2 - b1) / (a2 - a1)
}

/* Thanks to redblobgames! <3 */
function wrap(num, limit) {
  return (num % limit + limit) % limit;
}

function lerp(start, stop, amount) {
  return start + (stop - start) * amount;
};

function lerpClamped(start, stop, amount) {
  amount = Math.max(0, Math.min(1, amount));
  return start + (stop - start) * amount;
};

function lerpWrapped(start, stop, amount) {
  amount = amount % 1;
  return start + (stop - start) * amount;
}

function oscillate(t, length) {
  if (length === 0) return 0;

  const cycle = Math.floor(t / length);
  const position = t % length;

  return (cycle % 2 === 0) ? position : length - position;
}

const TAU = Math.PI * 2;

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

export { Vector2, randomInt, randomFloat, randomRGB, clamp, map, remapRange, wrap, lerp, oscillate, TAU, degreesToRadians, radiansToDegrees };
