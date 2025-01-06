<template>
  <div id="interface">
    <div id="command-output" ref="commandOutput">
      <Default-Command v-if=" ! hasCommandHistory" input="INFO" output="No command history!" />

      <div v-for="[input, output] in output" ref="cmdEntry">
        <Default-Command :input="input" :output="output" />
      </div>
    </div>

    <div id="command-input">
      <input type="text" v-model="inputText" @keyup.enter="processCommand" @keyup.up="goBack" @keyup.down="goForward" placeholder="Enter Command" />
    </div>
  </div>
</template>

<script>
// TODO: Commands need to return an array of [status, output] - the status will
//       be used so that for example if the player does `go north` and that move
//       is not possible, then a status of `FAILURE` will be passed into the command
//       component, so that it can then render a red box instead of the default.

// TODO: When using the arrow (up/down) keys to navigate through the command
//       history, the cursor moves around - try to find a way to always keep
//       the cursor at the start OR the end.

import DefaultCommand from "commands/Default.vue";

import { randomElement } from "../utilities/array.js";

import '../interface.css';

/*
  Enumerated types and lookup tables and stuff.
*/

// TODO: Move to a more suitable location.

const VALID_DIRECTIONS = [
  "N", "E", "S", "W", "NORTH", "EAST", "SOUTH", "WEST"
];

function prettyDirectionName(direction = "") {
  let upperDir = direction.toUpperCase();

  switch (upperDir) {
    case "N":
      return "north";
      break;
    case "E":
      return "east";
      break;
    case "S":
      return "south";
      break;
    case "W":
      return "west";
      break;
    default:
      return direction.toLowerCase();
      break;
  }
}

const CONTAINER_TYPES = {
  LOCKER:     1,
  FOOTLOCKER: 2,
  STRONG_BOX: 3,
  METAL_BOX:  4,
  BACKPACK:   5,
  CORPSE:     6
};

/*
  Main game state.
*/


// TODO: Move the following game state, perhaps to a `state.js` with a nice 
//       and simple `export const state = reactive({});` to begin with and 
//       Pinia later?

let currentRoom = 1;

/*
  Global flags.

  Used by various systems (quests, dialogue etc.) to check if certain things have
  or have not been done/seen/defeated/whatever.
*/

let globalFlags = {
  NAVI_COMPUTER_LOCKED: true,
  PROLOGUE_DRIVE_REPAIRED: false
};

/*
  Player statistics.

  Track various things so we can in future provide a nice cool statistics screen.
*/

let statistics = {
  MINUTES_PLAYED: 0
};

/*
  Room data.

  Contains all the room data for the level.
*/

// TODO: Add concept of levels (which are a collection of rooms).

// TODO: Move to rooms being instances of a Room class?

// TODO: Weighted randomness for lore texts.

// TODO: Checks system, where certain things are checked before a piece of 
//       lore can be chosen:
//         - Check (global) flags (e.g. `FLAGS.TUTORAL_COMPLETED`)
//         - Check character attributes (e.g. `SKILLS.REPAIR > 5`)
//         - etc.

const rooms = [
  {
    id: 1,
    name: "Cockpit",
    connections: {
      EAST:  2, // Communications
      SOUTH: 4  // Engine Room
    },
    lore: [
      {
        text: "The navi-computer is currently locked, as such travel is not possible.",
        checks: {
          flags: [
            ["NAVI_COMPUTER_LOCKED", true]
          ]
        }
      },
      {
        text: "Someone seems to have spilt some space-mayonnaise on the pilot's chair.",
        checks: {
          attributes: [
            ["AWARENESS", [">", 5]]
          ]
        }
      },
      {
        text: "You notice that there is a bust of Commander Shepard sitting upon a shelf."
      },
    ],
    containers: [
      {
        type: CONTAINER_TYPES.LOCKER,
        lootTables: [
          "PROLOGUE_LOOT_COMMON",
          "PROLOGUE_ENGINE_PARTS"
        ],
        generated: false,
        inventory: []
      }
    ]
  },
  {
    id: 2,
    name: "Communications",
    connections: {
      WEST:  1, // Cockpit
      SOUTH: 3  // Medical Bay
    },
    lore: [

    ]
  },
  {
    id: 3,
    name: "Medical Bay",
    connections: {
      NORTH: 2, // Communications
      WEST:  4  // Engine Room
    },
    lore: [

    ]
  },
  {
    id: 4,
    name: "Engine Room",
    connections: {
      NORTH: 1, // Cockpit
      EAST:  3, // Medical Bay
    },
    lore: [

    ]
  }
];

function getRoomById(id) {
  return rooms.find(room => room.id === id);
}

/*
  Command list.
*/

// TODO: Store commands in perhaps a CommandManager instance.

// TODO: Commands themselves are instances of a Command class.

// TODO: Specify a Vue component to render into the command history.

const commands = [
  {
    trigger: "rand",
    aliases: ["random"],
    run() {
      return Math.random();
    }
  },

  /*
    Tells the player which room they're currently in.
  */

  {
    trigger: "where",
    aliases: ["whereami"],
    run() {
      let room = getRoomById(currentRoom);
      let name = room?.name ?? "unknown";

      return `Your current location is: ${name}.`;
    }
  },

  /*
    Lists all the connections from the current room to other rooms.
  */

  {
    trigger: "doors",
    aliases: ["doorways"],
    run() {
      let room = getRoomById(currentRoom);
      let connections = room?.connections ?? null;

      if ( ! connections) {
        return "There are no doors in this room."
      }

      let directions = Object.entries(connections).map(([direction, roomId]) => {
        let newRoom = getRoomById(roomId);
        let newRoomName = newRoom?.name ?? "unknown";
        return `To the ${direction.toLowerCase()} lies a door to ${newRoomName}.`;
      });

      return directions;
    }
  },

  /*
    Describe/explain an entity.

    If no entity is specified, then describe the current room.
  */

  // TODO: How to differentiate if there are e.g. two entities of the same type?
  
  // TODO: Add support for <entity>.

  {
    trigger: "describe",
    aliases: ["explain"],
    run(entity) {
      if ( ! entity) {
        let room = getRoomById(currentRoom);
        let lore = room.lore ?? [];

        if ( ! lore.length) {
          return "There is nothing to explain.";
        }
        
        let chosenLore = randomElement(lore);

        return chosenLore.text;
      }
    }
  },

  /*
    Move between rooms.
  */

  // TODO: Make it so that `move` with no direction specified displays the
  //       available directions instead of "you can't move in that direction".

  {
    trigger: "walk",
    aliases: ["move", "travel", "go"],
    run(direction) {
      let prettyDir = prettyDirectionName(direction);

      if ( ! VALID_DIRECTIONS.includes(direction?.toUpperCase())) {
        return 'You cannot move in that direction!';
      }

      let room = getRoomById(currentRoom);

      if ( ! room) {
        throw new Error(`Unable to find current room (ID: ${currentRoom})!`);
      }

      let connections = room.connections;
      let connection = connections[prettyDir.toUpperCase()];

      if (connection) {
        console.info(`Setting currentRoom to ${connection}.`);

        currentRoom = connection;
        let newRoom = getRoomById(currentRoom);

        return `You moved ${prettyDir}wards to ${newRoom.name}.`;
      }
      
      return 'You cannot move in that direction!';
    }
  }
];

export default {
  components: {
    DefaultCommand
  },

  data() {
    return {
      inputText: "",
      history: [],
      output: [],
      historyCurrent: -1
    }
  },

  mounted() {
    for (let i = 0; i < 30; i++) {
      this.output.push([
        "rand", Math.random()
      ]);
    }

    this.$nextTick(() => {
      this.scroll();
    });
  },

  methods: {
    scroll() {
      let index = this.$refs.cmdEntry?.length - 1;
      let latestEntry = this.$refs.cmdEntry?.[index];

      if (latestEntry) {
        latestEntry.scrollIntoView();
      }
    },

    /*
      Navigate backwards through the input history.
    */

    goBack() {
      this.historyCurrent--;

      if (this.historyCurrent < 0) {
        this.historyCurrent = 0;
      }

      this.inputText = this.history[this.historyCurrent];
    },

    /*
      Navigate forwards through the input history.
    */

    goForward() {
      this.historyCurrent++;

      if (this.historyCurrent > this.history.length - 1) {
        this.historyCurrent = this.history.length - 1;
      }

      this.inputText = this.history[this.historyCurrent];
    },

    saveToHistory() {
      this.history.push(this.inputText);
      this.historyCurrent = this.history.length;
    },

    processCommand() {
      this.saveToHistory();
      let input = this.inputText.trim().split(" ");
      
      this.inputText = "";

      let [trigger, ...args] = input;

      // console.info("Processing command.");
      // console.info("Trigger: ", trigger);
      // console.info("Arguments: ", args);

      let command = commands.find(cmd => cmd.trigger === trigger);

      if ( ! command) {
        command = commands.find(cmd => cmd.aliases.includes(trigger));
      }

      if ( ! command) {
        return console.warn(`Unknown command: ${trigger}`);
      }

      let result = command.run(...args);

      this.output.push([input.join(" "), result]);

      this.$nextTick(() => {
        this.scroll();
      });
    }
  },

  computed: {
    hasCommandHistory() {
      return this.output.length > 0;
    }
  }
}
</script>

<style scoped>
div#interface {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

div#command-output {
  flex: 1;
  background-color: var(--purple-3);
  height: calc(100vh - 32px);
  padding: 1em 1em 0 1em;
  overflow-y: scroll; 
}

input {
  font-family: monospace;
  width: 100vw;
  padding: 4px 8px;
  margin: 0;
  border: 0;
  border-top: 2px solid black;
  height: 32px;
  line-height: 32px;
  background-color: var(--purple-1);
  color: white;
  font-size: 16px;
}
</style>
