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

export { VALID_DIRECTIONS, prettyDirectionName };
