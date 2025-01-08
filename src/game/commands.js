// import { randomElement } from "utilities/array.js";
import { COLOURS } from "utilities/colours";

import { getStore } from "./store.js";

export const commands = [
  {
    trigger: "rand",
    aliases: ["random"],
    run() {
      return Math.random();
    }
  },

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
];
