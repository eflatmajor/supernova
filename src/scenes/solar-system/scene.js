import { randomInt, randomRGB, remapRange, wrap, lerp, oscillate } from "utilities/maths";
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
  ctx.filter = `brightness(${Math.floor(this.sun.brightness)}%)`;
  ctx.drawImage(this.assets.emberColossus, sunX, sunY);
  ctx.filter = "none";
  ctx.closePath();
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
