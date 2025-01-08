import { defineStore } from "pinia";

export const useGameStore = defineStore('game', {
  state() {
    return {
      colourScheme: "purple",
      currentRoom: 1
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
