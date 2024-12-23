<template>
  <div id="interface">
    <div id="command-output" ref="commandOutput">
      <div v-if=" ! hasCommandHistory" class="command-entry">
        <p>No command history!</p>
      </div>

      <div class="command-entry" v-for="item in history" ref="cmdEntry">
        <p>{{ item }}</p>
      </div>

      <Default-Command input="move south" output="You moved southwards to Engine Room." />

      <Default-Command input="whereami" output="Your current location is: Engine Room." />

      <Default-Command input="explain" output="Someone seems to have spilt some space-mayonnaise on the pilot's chair." />

      <Default-Command input="test" :output="['testing', 'command', 'with', 'multiple', 'outputs', 'and also testing things that', 'take up', 'more space than the width', 'of the list item elements']" />
    </div>

    <div id="command-input">
      <input type="text" v-model="inputText" @keyup.enter="processCommand" placeholder="Enter Command" />
    </div>
  </div>
</template>

<script>
/*
  TODO:

  - Make it so that you can press the UP/DOWN arrows to go through your
    input history, when the command entry area is highlighted.
*/

import DefaultCommand from "commands/Default.vue";

import { randomElement } from "../utilities/array.js";

import '../interface.css';

/*
  Enumerated types and lookup tables and stuff.

  TODO:

  - Move to a more suitable location.
*/

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
  TODO:

  Move the following game state, perhaps to a `state.js` with a nice and simple
  `export const state = reactive({});` to begin with and Pinia later?
*/

//
// Main game state
//

let currentRoom = 1;

//
// Used by various systems (quests, dialogue etc.) to check if certain things have
// or have not been done/seen/defeated/whatever.
//

let globalFlags = {
  NAVI_COMPUTER_LOCKED: true,
  PROLOGUE_DRIVE_REPAIRED: false
};

//
// Track various things so we can in future provide a nice cool statistics screen.
//

let statistics = {
  MINUTES_PLAYED: 0
};

/*
  TODO:

  - Add concept of levels (which are a collection of rooms).
  - Move to rooms being instances of a Room class.
  - Lore text stuff:
    - Weighted randomness for lore texts.
    - Checks system, where certain things are checked before a piece of lore can be chosen:
      - Able to check against (global) flags (e.g. `FLAGS.TUTORAL_COMPLETED`)
      - Able to check against character attributes (e.g. `SKILLS.REPAIR > 5`)
*/
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
    }
  },
  {
    id: 4,
    name: "Engine Room",
    connections: {
      NORTH: 1, // Cockpit
      EAST:  3, // Medical Bay
    }
  }
];

function getRoomById(id) {
  return rooms.find(room => room.id === id);
}

/*
  TODO:

  - [x] Command aliases
  - [ ] Store commands in perhaps a CommandManager instance.
  - [ ] Commands themselves are instances of a Command class.
  - [ ] Specify a Vue component to render into the command history.
  - [ ] Optional title that renders as bold before the cmd's output?
*/
const commands = [
  {
    trigger: "rand",
    aliases: ["random"],
    run() {
      return Math.random();
    }
  },

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
    If no <entity> then describe the current room. Otherwise describe 
    the <entity>.

    TODO:

    - How to differentiate if there are e.g. two entities of the same type?
    - Add support for <entity>.
  */
  {
    trigger: "describe",
    aliases: ["explain"],
    run(entity) {
      if ( ! entity) {
        let room = getRoomById(currentRoom);
        let lore = room.lore;
        
        let chosenLore = randomElement(lore);

        return chosenLore.text;
      }
    }
  },

  {
    trigger: "walk",
    aliases: ["move", "travel", "go"],
    /*
      TODO

      - Make it so that `move` with no direction specified displays the
        available directions instead of "you can't move in that direction"? 
    */
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
      history: []
    }
  },

  mounted() {
    for (let i = 0; i < 30; i++) {
      this.history.push(Math.random());
    }

    this.$nextTick(() => {
      this.scroll();
    });
  },

  methods: {
    scroll() {
      let index = this.$refs.cmdEntry?.length - 1;
      let latestEntry = this.$refs.cmdEntry?.[index];

      // console.log(latestEntry);
      console.log(this.$refs.cmdEntry, latestEntry);

      if (latestEntry) {
        latestEntry.scrollIntoView();
      }
    },

    processCommand() {
      let input = this.inputText.trim().split(" ");
      this.inputText = "";

      let [trigger, ...args] = input;

      console.info("Processing command.");
      console.info("Trigger: ", trigger);
      console.info("Arguments: ", args);

      let command = commands.find(cmd => cmd.trigger === trigger);

      if ( ! command) {
        command = commands.find(cmd => cmd.aliases.includes(trigger));
      }

      if ( ! command) {
        return console.warn(`Unknown command: ${trigger}`);
      }

      let result = command.run(...args);

      if (Array.isArray(result)) {
        this.history.push(...result);
      }
      else {
        this.history.push(result);
      }

      this.$nextTick(() => {
        this.scroll();
      });
    }
  },

  computed: {
    hasCommandHistory() {
      return this.history.length > 0;
    }
  }
}
</script>

<style scoped>
div#interface {
  background-color: red;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

div#command-output {
  flex: 1;
  background-color: green;
  height: calc(100vh - 32px);
  padding: 1em 1em 0 1em;
  /* overflow: hidden; */
  overflow-y: scroll; 
}

div.command-entry {
  margin: 0.5em 0;
}

input {
  width: 100vw;
  padding: 0 8px;
  margin: 0;
  border: 0;
  height: 32px;
  line-height: 32px;
  background-color: blue;
  color: white;
  font-size: 16px;

}
</style>