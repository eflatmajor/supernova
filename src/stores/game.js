import { defineStore } from "pinia";
import { FLAGS } from "game/flags.js";
import { STATISTICS } from "../game/statistics";

export const useGameStore = defineStore('game', {
  state() {
    return {
      colourScheme: "purple",
      currentRoom: 1,
      flags: {
        [FLAGS.NAVI_COMPUTER_LOCKED]: true,
        [FLAGS.PROLOGUE_DRIVE_REPAIRED]: false

      },
      statistics: {
        [STATISTICS.MINUTES_PLAYED]: 0
      }
    };
  },
  persist: {
    debug: true,
    beforeHydrate(context) {
      console.info(`beforeHydrate - ${context.store.$id}.`);
    },
    afterHydrate(context) {
      console.info(`afterHydrate - ${context.store.$id}.`);
    }
  },
  getters: {},
  actions: {}
});
