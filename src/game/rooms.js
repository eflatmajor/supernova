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
    description: "Flickering holographic displays cast an eerie blue glow across the cramped cockpit, illuminating worn control panels studded with glowing buttons and switches. Outside the viewport, the swirling nebula stretches into infinity.",
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
    description: "A web of glowing fiber-optic cables snake across the walls of the comms room, converging on a central console where a tense officer is monitoring a bank of static-laced screens. Urgent messages flashed across the displays, warnings of encroaching enemy vessels and desperate pleas for reinforcements.",
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
    description: "The sterile white medical bay hums with the low thrum of diagnostic equipment, its walls lined with glowing bio-monitors displaying vital signs in crisp green text.",
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
    description: "The engine room roars with barely-contained power, a cathedral of gleaming metal and sparking conduits where colossal engines pulse with blinding energy.",
    connections: {
      NORTH: 1, // Cockpit
      EAST:  3, // Medical Bay
    },
    lore: [
      {
        text: "You think you could improve hyper-drive efficiency slightly if you trained more in Repair.",
        checks: {
          attributes: [
            ["REPAIR", ["<", 5]]
          ]
        }
      },
      {
        text: "Due to your skill in Repair you are able to upgrade the hyper-drive's efficiency.",
        checks: {
          attributes: [
            ["REPAIR", [">=", 5]]
          ],
          flags: [
            ["HYPERDRIVE_UPGRADED", "false"]
          ]
        }
      },
    ]
  }
];

function getRoomById(id) {
  return rooms.find(room => room.id === id);
}

export { rooms, getRoomById };
