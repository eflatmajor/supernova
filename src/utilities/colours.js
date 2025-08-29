import { randomRGB } from "utilities/maths";

/*
  Accepted colours for `colourScheme`.
*/
const COLOURS = [
  "purple",
  "red",
  "blue",
  "green",
  "yellow"
];

export {
  randomRGB, // Re-export randomRGB() from utilities/maths because... why not?
  COLOURS
}