/*
  The ChecksSystem is designed to be a vary versatile system, which can probably be used in many places in the game.

  It's sole purpose is to take in an array of objects and if there are checks
  process them all. Based on those checks, the system will decide which objects
  to discard from the array that will be returned

  CHECK IDEAS:

    - Check if a flag (basically global boolean game state) is true or false
    - Check if a data (global state for other data types) is what you want
    - Check a game statistic matches some value
    - Check against player data such as skills, feats, attributes
    - Check if a specific item is in the player's inventory

  EXAMPLE OF A CHECKS OBJECT:

    checks: {
      flags: [
        ["FLAG_EXAMPLE", true]
      ],
      statistics: [
        ["TIME_PLAYED", [">", 300000]]
      ]
    }
*/

export default class ChecksSystem {
  #instance = null;

  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.#instance = this;
  }
}
