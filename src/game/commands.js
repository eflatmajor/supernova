import { randomElement } from "utilities/array.js";
import { COLOURS } from "utilities/colours";

import { getRoomById } from "./rooms.js";
import { getStore } from "./store.js";

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
    Allows the player to choose a colour scheme.
  */

  {
    trigger: "theme",
    aliases: ["color", "colour", "scheme"],
    run(colour) {
      let store = getStore();
      colour = colour ?? "";

      if (colour === "") {
        return `Current colour scheme: ${store.colourScheme}.`;
      }

      if ( ! COLOURS.includes(colour)) {
        return `Valid colour schemes: ${COLOURS.join(", ")}`;
      }

      store.colourScheme = colour;

      return `Successfully set the colour scheme to ${colour}.`;
    }
  },

  /*
    Tells the player which room they're currently in.
  */

  {
    trigger: "where",
    aliases: ["whereami"],
    run() {
      let store = getStore();
      let room = getRoomById(store.currentRoom);
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
      let store = getStore();
      let room = getRoomById(store.currentRoom);
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
      let store = getStore();

      if ( ! entity) {
        let room = getRoomById(store.currentRoom);
        let lore = room.lore ?? [];

        if ( ! lore.length) {
          return "There is nothing to explain.";
        }

        let chosenLore = randomElement(lore);

        return chosenLore.text;
      }
    }
  },
];
