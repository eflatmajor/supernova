import {
  randomInt,
  randomRGB,
  remapRange,
  wrap,
  lerp,
  oscillate,
  TAU,
  degreesToRadians
} from "utilities/maths";
import { takeElement, randomElement } from "utilities/array";

/*
  TODO:
    - Create a class for planets, moons, asteroids (same class for all celestial
      bodies, or not?), and the sun.
      - Make them able to render a circle/ellipse representing the orbital path.
    - Create an asteroid field (once we have the artwork!)
    - Get basic orbits working (not a proper gravitational simulation, just fake it!)
    - Camera/Viewport
      - Ability to pan the camera
      - Ability to zoom the camera
      - Make the camera able to follow the player's ship
      - Add zoom levels, so people w/ different resolutions can choose a zoom leve
        that works best for their resolution/aspect ratio.
    - Other layers (potentially parallax?)
      - Add background stars
      - Add background nebulae
    - Player ship
      - Basic movement (WASD and/or arrow keys)
      - Rotate the ship so it makes sense based on the direction of movement
      - [?] Should celestial bodies have a gravitational effect on the ship?
        - +1 for realism
        - +1 for fun (e.g using a gravity well to slingshot yourself)
        - -1 for ease of control
        - ???
      - Polish
        - Get artwork for shadows of bodies, render based on direction to/from the sun!
        - Animation for thrusters of player ship.
      - ???
*/

function createStarfield() {
  console.log("[SCENE] solar-system: createStarfield()");

  const NUM_SMALL_STARS  = 700;
  const NUM_MEDIUM_STARS = 200;
  const NUM_LARGE_STARS  = 50;

  const SMALL_STARS  = ["star-blue-s", "star-pale-s", "star-yellow-s"];
  const MEDIUM_STARS = ["star-blue-m", "star-pale-m", "star-yellow-m"];
  const LARGE_STARS  = ["star-blue-l", "star-pale-l", "star-yellow-l"];

  for (let i = 0; i < NUM_SMALL_STARS; i++) {
    let assetName = randomElement(SMALL_STARS);
    let asset = this.assets[assetName];

    let star = {
      x: randomInt(0, this.width),
      y: randomInt(0, this.height),

      opacity: 1.0,
      asset: asset,
      size: asset.width,
      variant: "small"
    };

    // console.log(`Created star of variant "${assetName}".`, star);

    this.stars.push(star);
  }

  for (let i = 0; i < NUM_MEDIUM_STARS; i++) {
    let assetName = randomElement(MEDIUM_STARS);
    let asset = this.assets[assetName];

    let star = {
      x: randomInt(0, this.width),
      y: randomInt(0, this.height),
      asset: asset,
      size: asset.width,
      variant: "medium"
    };

    // console.log(`Created star of variant "${assetName}".`, star);

    this.stars.push(star);
  }

  for (let i = 0; i < NUM_LARGE_STARS; i++) {
    let assetName = randomElement(LARGE_STARS);
    let asset = this.assets[assetName];

    let star = {
      x: randomInt(0, this.width),
      y: randomInt(0, this.height),
      asset: asset,
      size: asset.width,
      variant: "large"
    };

    // console.log(`Created star of variant "${assetName}".`, star);

    this.stars.push(star);
  }
}

function createNebulae() {
  console.log("[SCENE] solar-system: createNebulae()");

  let availableNebulae = [
    "alpha-1",
    "beta-1",
    "gamma-1",
    "delta-1",
    "epsilon-1",
    "zeta-1"
  ];

  const NUM_NEBULAE = availableNebulae.length; // 10;

  for (let i = 0; i < NUM_NEBULAE; i++) {
    let nebulaName = takeElement(availableNebulae);

    let asset = this.assets[nebulaName];

    if ( ! asset) {
      console.warn(`Couldn't find a loaded image asset for nebula "${nebulaName}"!`);
      return;
    }

    let nebula = {
      x: randomInt(0, this.width),
      y: randomInt(0, this.height),
      name: nebulaName,
      asset: asset,
      width: asset.width,
      height: asset.height
    };

    console.log(`Created nebula "${nebulaName}".`, nebula);

    this.nebulae.push(nebula);
  }
}

function createAsteroidBelt() {
  console.log("[SCENE] solar-system: createAsteroidBelt()");

  const ASTEROID_DISTANCE_FROM_SUN = 200;
  const ASTEROID_SPAWN_COUNT_LARGE = 18;
  const ASTEROID_SPAWN_COUNT_MEDIUM = 50;
  const ASTEROID_SPAWN_COUNT_SMALL = 70;
  const ASTEROID_POSITION_JITTER_MIN = 0; //-15;
  const ASTEROID_POSITION_JITTER_MAX = 0; // 15;
  const ASTEROID_RADIUS = 20;

  const asteroidCount = ASTEROID_SPAWN_COUNT_LARGE;
  const angleStep = TAU / asteroidCount;

  for (let i = 0; i < asteroidCount; i++) {
    const angle = i * angleStep;

    const jitterX = randomInt(
      ASTEROID_POSITION_JITTER_MIN,
      ASTEROID_POSITION_JITTER_MAX
    );
    const jitterY = randomInt(
      ASTEROID_POSITION_JITTER_MIN,
      ASTEROID_POSITION_JITTER_MAX
    )

    // TODO: Make this be reactive for when the viewport is resized.
    let x = this.centerX + ASTEROID_DISTANCE_FROM_SUN * Math.cos(angle);
    let y = this.centerY + ASTEROID_DISTANCE_FROM_SUN * Math.sin(angle);

    x += jitterX;
    y += jitterY;

    const asset = this.assets["asteroid-w-31x29-1"];
    const width = asset.width;
    const height = asset.height;
    const rotation = degreesToRadians(randomInt(0, 360));

    const asteroid = {
      x, y, asset, width, height, rotation, radius: ASTEROID_RADIUS
    };

    console.log("rotation", asteroid.rotation);

    this.asteroids.push(asteroid);
  }

  console.log("asteroids created", this.asteroids);
}

function createPlanets() {
  console.log("[SCENE] solar-system: createPlanets()");

  let availablePlanets = [
    "aerilon",
    "aetheria",
    "nocturneVI",
    "pyraMinor",
    "veridia"
  ];

  let length = availablePlanets.length;

  for (let i = 0; i < length; i++) {
    let planetName = takeElement(availablePlanets);

    if ( ! planetName) {
      console.warn(`No remaining available planets when trying to create planet #${i + 1}!`);
      return;
    }

    let asset = this.assets[planetName];

    if ( ! asset) {
      console.warn(`Couldn't find a loaded image asset for planet "${planetName}"!`);
      return;
    }

    let planet = {
      x: randomInt(0, this.width),
      y: randomInt(0, this.height),
      r: randomInt(25, 75),
      // rgb: randomRGB(),
      name: planetName,
      asset: asset,
      size: asset.width
    };

    console.log(`Created planet "${planetName}".`, planet);

    this.planets.push(planet);
  }
}

export async function load() {
  console.log("[SCENE] solar-system: load()");

  //
  // Load celestial body images.
  //

  return this.addAssets([
    // Sun
    ["emberColossus", "/celestial_bodies/ember-colossus.png"],

    // Planets
    ["aerilon", "/celestial_bodies/aerilon.png"],
    ["aetheria", "/celestial_bodies/aetheria.png"],
    ["nocturneVI", "/celestial_bodies/nocturne-vi.png"],
    ["pyraMinor", "/celestial_bodies/pyra-minor.png"],
    ["veridia", "/celestial_bodies/veridia.png"],

    // MoonsO
    ["veridiaI", "/celestial_bodies/veridia-i.png"],

    // Nebulae
    ["alpha-1", "/celestial_bodies/nebulae/nebula-alpha-1-104x121.png"],
    ["beta-1", "/celestial_bodies/nebulae/nebula-beta-2.1-192x211.png"],
    ["gamma-1", "/celestial_bodies/nebulae/nebula-gamma-1-193x214-bettertransparency.png"],
    ["delta-1", "/celestial_bodies/nebulae/nebula-delta-1-146x188.png"],
    ["epsilon-1", "/celestial_bodies/nebulae/nebula-epsilon-1-94x124.png"],
    ["zeta-1", "/celestial_bodies/nebulae/nebula-zeta-1-170x105.png"],

    // Stars
    ["star-blue-s", "/celestial_bodies/stars/star-blue-1x1.png"],
    ["star-blue-m", "/celestial_bodies/stars/star-blue-7x7.png"],
    ["star-blue-l", "/celestial_bodies/stars/star-blue-17x17.png"],

    ["star-pale-s", "/celestial_bodies/stars/star-pale-1x1.png"],
    ["star-pale-m", "/celestial_bodies/stars/star-pale-7x7.png"],
    ["star-pale-l", "/celestial_bodies/stars/star-pale-17x17.png"],

    ["star-yellow-s", "/celestial_bodies/stars/star-yellow-1x1.png"],
    ["star-yellow-m", "/celestial_bodies/stars/star-yellow-7x7.png"],
    ["star-yellow-l", "/celestial_bodies/stars/star-yellow-17x17.png"],

    // Asteroids
    ["asteroid-o-13x21-38", "/celestial_bodies/asteroids/asteroid-o-13x21-38.png"],
    ["asteroid-o-13x26-37", "/celestial_bodies/asteroids/asteroid-o-13x26-37.png"],
    ["asteroid-o-25x14-36", "/celestial_bodies/asteroids/asteroid-o-25x14-36.png"],
    ["asteroid-w-10x16-27", "/celestial_bodies/asteroids/asteroid-w-10x16-27.png"],
    ["asteroid-w-11x11-5", "/celestial_bodies/asteroids/asteroid-w-11x11-5.png"],
    ["asteroid-w-12x16-6", "/celestial_bodies/asteroids/asteroid-w-12x16-6.png"],
    ["asteroid-w-13x15-23", "/celestial_bodies/asteroids/asteroid-w-13x15-23.png"],
    ["asteroid-w-13x16-7", "/celestial_bodies/asteroids/asteroid-w-13x16-7.png"],
    ["asteroid-w-14x14-14", "/celestial_bodies/asteroids/asteroid-w-14x14-14.png"],
    ["asteroid-w-14x35-28", "/celestial_bodies/asteroids/asteroid-w-14x35-28.png"],
    ["asteroid-w-15x12-18", "/celestial_bodies/asteroids/asteroid-w-15x12-18.png"],
    ["asteroid-w-15x13-4", "/celestial_bodies/asteroids/asteroid-w-15x13-4.png"],
    ["asteroid-w-15x19-3", "/celestial_bodies/asteroids/asteroid-w-15x19-3.png"],
    ["asteroid-w-15x19-9", "/celestial_bodies/asteroids/asteroid-w-15x19-9.png"],
    ["asteroid-w-15x20-17", "/celestial_bodies/asteroids/asteroid-w-15x20-17.png"],
    ["asteroid-w-16x27-16", "/celestial_bodies/asteroids/asteroid-w-16x27-16.png"],
    ["asteroid-w-16x27-20", "/celestial_bodies/asteroids/asteroid-w-16x27-20.png"],
    ["asteroid-w-17x17-21", "/celestial_bodies/asteroids/asteroid-w-17x17-21.png"],
    ["asteroid-w-17x19-8", "/celestial_bodies/asteroids/asteroid-w-17x19-8.png"],
    ["asteroid-w-18x18-22", "/celestial_bodies/asteroids/asteroid-w-18x18-22.png"],
    ["asteroid-w-19x12-26", "/celestial_bodies/asteroids/asteroid-w-19x12-26.png"],
    ["asteroid-w-19x18-2", "/celestial_bodies/asteroids/asteroid-w-19x18-2.png"],
    ["asteroid-w-20x19-13", "/celestial_bodies/asteroids/asteroid-w-20x19-13.png"],
    ["asteroid-w-20x23-19", "/celestial_bodies/asteroids/asteroid-w-20x23-19.png"],
    ["asteroid-w-20x25-15", "/celestial_bodies/asteroids/asteroid-w-20x25-15.png"],
    ["asteroid-w-21x17-24", "/celestial_bodies/asteroids/asteroid-w-21x17-24.png"],
    ["asteroid-w-21x20-12", "/celestial_bodies/asteroids/asteroid-w-21x20-12.png"],
    ["asteroid-w-23x26-11", "/celestial_bodies/asteroids/asteroid-w-23x26-11.png"],
    ["asteroid-w-24x24-10", "/celestial_bodies/asteroids/asteroid-w-24x24-10.png"],
    ["asteroid-w-24x25-25", "/celestial_bodies/asteroids/asteroid-w-24x25-25.png"],
    ["asteroid-w-31x29-1", "/celestial_bodies/asteroids/asteroid-w-31x29-1.png"],
    ["asteroid-y-12x19-31", "/celestial_bodies/asteroids/asteroid-y-12x19-31.png"],
    ["asteroid-y-16x25-33", "/celestial_bodies/asteroids/asteroid-y-16x25-33.png"],
    ["asteroid-y-20x19-34-35", "/celestial_bodies/asteroids/asteroid-y-20x19-34-35.png"],
    ["asteroid-y-20x26-32", "/celestial_bodies/asteroids/asteroid-y-20x26-32.png"],
    ["asteroid-y-21x19-29", "/celestial_bodies/asteroids/asteroid-y-21x19-29.png"],
    ["asteroid-y-28x13-30", "/celestial_bodies/asteroids/asteroid-y-28x13-30.png"]
  ]);
}

export function setup() {
  console.log("[SCENE] solar-system: setup()");

  //
  // Disable image smoothing to prevent resizing blurring our pixel art.
  //
  this.context.imageSmoothingEnabled = false;

  //
  // Setup scene-global state.
  //

  this.sun = {
    x: this.width / 2,
    y: this.height / 2,
    r: 42,
    brightness: 100
  };

  this.stars = [];
  this.planets = [];
  this.nebulae = [];
  this.asteroids = [];

  //
  // Bind scene-specific functions.
  //

  this.bindMethods([
    createPlanets,
    createStarfield,
    createNebulae,
    createAsteroidBelt,

    renderStarField,
    renderSun,
    renderOrbitMarkers,
    renderPlanets,
    renderMoons,
    renderNebulae,
    renderAsteroidBelt,
    renderDebugMousePosition,
  ]);

  //
  // Spawn celestial bodies.
  //

  this.createPlanets();
  console.log(`createPlanets() - Created (${this.planets.length}) planets.`, this.planets);

  this.createStarfield();
  console.log(`createStarfield() - Created (${this.stars.length}) stars.`, this.stars);

  this.createNebulae();
  console.log(`createNebulae() - Created (${this.nebulae.length}) nebulae.`, this.nebulae);

  this.createAsteroidBelt();
  console.log(`createAsteroidBelt() - Created (${this.asteroids.length}) asteroids.`, this.asteroids);
}

export function input(event) {
  // event.preventDefault();
  console.log("[SCENE] solar-system: input", event);
}

export function update(t, dT) {
  // console.log(`[SCENE] solar-system: update : 60Hz`);
}

export function update30TPS(t, dT) {
  // console.log("[SCENE] solar-system: (sub-)update @ 30Hz");
}

export function update15TPS(t, dT) {
  // console.log("[SCENE] solar-system: (sub-)update @ 15Hz");
}

export function render(timeElapsed, timeDelta) {
  // console.log("[SCENE] solar-system: render");

  this.renderStarField(timeElapsed, timeDelta);
  this.renderSun(timeElapsed, timeDelta);
  this.renderOrbitMarkers(timeElapsed, timeDelta);
  this.renderPlanets(timeElapsed, timeDelta);
  this.renderMoons(timeElapsed, timeDelta);
  this.renderNebulae(timeElapsed, timeDelta);
  this.renderAsteroidBelt(timeElapsed, timeDelta);
  // this.renderDebugMousePosition(timeElapsed, timeDelta);
}

function renderStarField() {
  const { context: ctx, stars, width, height } = this;

  ctx.clearRect(0, 0, width, height);

  for (let star of stars) {
    ctx.beginPath();

    /*
    ctx.fillStyle = "#ffffff";
    ctx.ellipse(star.x, star.y, 1, 1, 0, 0, Math.PI * 2);
    ctx.fill();
    */

    ctx.drawImage(star.asset, Math.floor(star.x - star.size / 2), Math.floor(star.y - star.size / 2));

    ctx.closePath();
  }
}

function renderSun() {
  const { context: ctx, width, height } = this;

  const sunDiameter = this.assets.emberColossus.width;
  const sunX = (width / 2) - (sunDiameter / 2);
  const sunY = (height / 2) - (sunDiameter / 2);

  this.sun.brightness += 0.5;

  if (this.sun.brightness >= 400) {
    this.sun.brightness = 100;
  }

  ctx.beginPath();
  // ctx.filter = `brightness(${Math.floor(this.sun.brightness)}%)`;
  ctx.drawImage(this.assets.emberColossus, sunX, sunY);
  ctx.filter = "none";
  ctx.closePath();

  ctx.fillStyle = "red";
  ctx.arc(this.centerX, this.centerY, 5, 0, TAU);
  ctx.fill();
}

function renderOrbitMarkers() {
  const { context: ctx} = this;


}

function renderPlanets() {
  const { context: ctx, planets } = this;

  for (let planet of planets) {
    ctx.beginPath();

    ctx.drawImage(planet.asset, planet.x - planet.size / 2, planet.y - planet.size / 2);

    // ctx.fillStyle = "red";
    // ctx.ellipse(planet.x, planet.y, 4, 4, 0, 0, Math.PI * 2);
    // ctx.fill();

    ctx.closePath();
  }
}

function renderMoons() {
  const { context: ctx} = this;


}

function renderNebulae() {
  const { context: ctx, nebulae } = this;

  for (let nebula of nebulae) {
    ctx.beginPath();

    // ctx.drawImage(nebula.asset, nebula.x - nebula.width / 2, nebula.y - nebula.height / 2);
    const scaleFactor = 0.5;

    ctx.drawImage(nebula.asset, nebula.x, nebula.y, nebula.width * scaleFactor, nebula.height * scaleFactor);

    /*
    ctx.fillStyle = "red";
    ctx.ellipse(nebula.x, nebula.y, 16, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    */

    ctx.closePath();
  }
}

function renderAsteroidBelt() {
  const { context: ctx, width, height } = this;

  for (let asteroid of this.asteroids) {
    ctx.save();
    ctx.beginPath();

    ctx.translate(
      asteroid.x, // - (asteroid.width / 2),
      asteroid.y // - (asteroid.height / 2)
    );

    ctx.rotate(asteroid.rotation);

    ctx.drawImage(
      asteroid.asset,
      -asteroid.width / 2,
      -asteroid.height / 2,
      asteroid.width,
      asteroid.height
    );

    /*
    ctx.fillStyle = "red";
    ctx.arc(0, 0, 5, 0, TAU);
    ctx.fill();
    */

    ctx.restore();
    ctx.closePath();
  }
}

function renderDebugMousePosition() {
  const { context: ctx, sun, width, height, mouseX, mouseY } = this;

  ctx.beginPath();
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${mouseX},${mouseY}`, width / 2, height / 2);
  ctx.closePath();
}
