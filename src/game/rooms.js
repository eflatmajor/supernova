const CONTAINER_TYPES = {
  LOCKER:     1,
  FOOTLOCKER: 2,
  STRONG_BOX: 3,
  METAL_BOX:  4,
  BACKPACK:   5,
  CORPSE:     6
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
    description: "Cockpit description.",
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
    description: "Communications description.",
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
    description: "Medical Bay description.",
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
    description: "Engine Room description.",
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

export { rooms, getRoomById };
