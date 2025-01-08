import { useGameStore } from "stores/game.js";
import { FLAGS } from "game/flags.js";
import { parseArgument } from "utilities/arguments.js";

/*
  Developer commands.
*/

export const commands = [

  /*
    Testing command for testing purposes.
  */

  {
    trigger: "rand",
    aliases: ["random"],
    run() {
      return Math.random();
    }
  },

  /*
    Shows all flags.
  */

  {
    trigger: "flags",
    aliases: [],
    run() {
      let store = useGameStore();

      return JSON.stringify(store.flags, null, 2);
    }
  },

    /*
      Modify the value of a single flag.
    */

    // TODO: It could be good to have some way to pass in numbers or booleans that
    //       are converted to their proper types. One method would be to have a
    //       prefix e.g. `boolean:` and `number:` so `flag foo boolean:true` would
    //       take the string `"true"` and convert it to a proper boolean. Could
    //       also support aliases like `boolean:1`, `boolean:yes` etc.

    {
      trigger: "flag",
      aliases: [],
      run(flag, value) {
        let store = useGameStore();
        let flags = Object.values(FLAGS);

        if ( ! flag || ! value) {
          return "You must pass a flag and a value."
        }

        if ( ! flags.includes(flag)) {
          return `You passed an unknown flag. Known flags: ${flags.join(", ")}.`;
        }

        value = parseArgument(value);
        store.flags[flag] = value;

        return `Updated value of flag "${flag}" to "${value}".`;
      }
    },

  /*
    Shows all statistics.
  */

    {
      trigger: "statistics",
      aliases: [],
      run() {
        let store = useGameStore();

        return JSON.stringify(store.statistics, null, 2);
      }
    }
];
